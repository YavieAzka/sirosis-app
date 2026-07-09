// File: app/database/save/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ==========================================
    // 1. VALIDASI TOKEN OTORISASI
    // ==========================================
    const validToken = process.env.SAVE_TOKEN;
    
    if (!validToken || body.token !== validToken) {
      return NextResponse.json(
        { error: 'Akses Ditolak: Token otorisasi tidak valid atau kosong.' }, 
        { status: 401 }
      );
    }

    // ==========================================
    // 2. FILTER & PENYESUAIAN SCHEMA (ANTI-CRASH)
    // ==========================================
    // Membuang variabel dari frontend yang TIDAK ADA di schema database
    const { 
      token, 
      ctp_encoded, 
      probability, 
      probability_los,
      // Helper kalkulator CTP dibuang agar tidak crash
      ctp_bilirubin, ctp_albumin, ctp_inr, ctp_ascites, ctp_eh, 
      ...patientData 
    } = body;

    // MASALAH 1: Generate 'patient_id' secara otomatis (Karena schema meminta String @id)
    // Format: PAT-Timestamp-RandomNumber
    patientData.patient_id = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // MASALAH 2: Mengisi 'lama_rawat' jika kosong (Karena schema meminta Int non-nullable)
    if (patientData.lama_rawat === undefined || patientData.lama_rawat === null) {
      patientData.lama_rawat = 0; 
    }

    // (Opsional) Konversi ctp_encoded menjadi string 'A', 'B', 'C' untuk kolom 'ctp' di database
    if (ctp_encoded === 1) patientData.ctp = 'A';
    if (ctp_encoded === 2) patientData.ctp = 'B';
    if (ctp_encoded === 3) patientData.ctp = 'C';

    // ==========================================
    // 3. PROSES SIMPAN PRISMA -> SUPABASE
    // ==========================================
    const prisma = getPrisma();
    
    const newPatient = await prisma.patient.create({
      data: patientData
    });

    return NextResponse.json({ success: true, data: newPatient });

  } catch (error: any) {
    console.error("Prisma Save Error:", error);
    return NextResponse.json(
      { error: `Gagal menyimpan ke database. Detail: ${error.message || 'Kesalahan Server Internal'}` }, 
      { status: 500 }
    );
  }
}