export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ==========================================
    // 1. VALIDASI TOKEN OTORISASI
    // ==========================================
    const validToken = process.env.SAVE_TOKEN;
    if (!validToken || body.token !== validToken) {
      return NextResponse.json(
        { error: "Akses Ditolak: Token otorisasi tidak valid atau kosong." },
        { status: 401 },
      );
    }

    // ==========================================
    // 2. PEMISAHAN DATA (Demografi vs AI vs Fitur Klinis)
    // ==========================================
    const {
      token,
      // Variabel Hasil Model AI (Sesuaikan dengan key dari Python)
      probability,
      predicted_class,
      base_value,
      shap_contributions,
      // Variabel Model LoS (Jika ada)
      probability_los,
      predicted_days,

      // Data Identitas Pasien (Opsional dari form)
      nama_pasien,
      rekam_medis,

      // Sisanya otomatis akan masuk ke dalam objek featuresInput
      ...featuresInput
    } = body;

    // Transformasi fitur klinis bawaan Anda
    if (featuresInput.ctp_encoded === 1) featuresInput.ctp = "A";
    if (featuresInput.ctp_encoded === 2) featuresInput.ctp = "B";
    if (featuresInput.ctp_encoded === 3) featuresInput.ctp = "C";

    if (
      featuresInput.lama_rawat === undefined ||
      featuresInput.lama_rawat === null
    ) {
      featuresInput.lama_rawat = 0;
    }

    // ==========================================
    // 3. PROSES SIMPAN PRISMA (RELASIONAL)
    // ==========================================
    const prisma = getPrisma();

    // A. Buat Record Pasien
    const fallbackId = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const patientRecord = await prisma.patient.create({
      data: {
        name: nama_pasien || "Anonim",
        medicalRecordNumber: rekam_medis || fallbackId,
      },
    });

    // B. Buat Record Prediksi Mortalitas (Jika data probability tersedia)
    let mortalityRecord = null;
    if (probability !== undefined) {
      mortalityRecord = await prisma.mortalityPrediction.create({
        data: {
          patient: { connect: { id: patientRecord.id } },
          featuresInput: featuresInput, // Prisma otomatis mengubah ini menjadi JSON
          probability: probability,
          predictedClass: predicted_class ?? 0,
          baseValue: base_value ?? 0,
          shapContributions: shap_contributions || null,
        },
      });
    }

    // C. Buat Record Prediksi LoS (Jika data probability_los / predicted_days tersedia)
    let losRecord = null;
    if (probability_los !== undefined || predicted_days !== undefined) {
      losRecord = await prisma.losPrediction.create({
        data: {
          patient: { connect: { id: patientRecord.id } },
          featuresInput: featuresInput, // Prisma otomatis mengubah ini menjadi JSON
          probabilityLos: predicted_days ?? probability_los ?? 0,
          meldScore: Number(featuresInput.meldScore) || 0,
          // Tambahkan baseValue dan shapContributions jika model LoS juga menghasilkannya
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        patient: patientRecord,
        mortality: mortalityRecord,
        los: losRecord,
      },
    });
  } catch (error: any) {
    console.error("Prisma Save Error:", error);
    return NextResponse.json(
      {
        error: `Gagal menyimpan ke database. Detail: ${error.message || "Kesalahan Server Internal"}`,
      },
      { status: 500 },
    );
  }
}
