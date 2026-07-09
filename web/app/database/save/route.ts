export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// TAMBAHAN BARU: Import driver Postgres
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    // 1. Ambil URL Database
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
    
    // 2. Buat Connection Pool PostgreSQL
    const pool = new Pool({ connectionString });
    
    // 3. Masukkan ke dalam Prisma Adapter
    const adapter = new PrismaPg(pool);
    
    // 4. Inisialisasi Prisma dengan Adapter (Wajib di Prisma versi terbaru)
    globalForPrisma.prisma = new PrismaClient({ adapter });
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
    const { 
      token, 
      ctp_encoded, 
      probability, 
      probability_los,
      ctp_bilirubin, ctp_albumin, ctp_inr, ctp_ascites, ctp_eh, 
      ...patientData 
    } = body;

    // Generate 'patient_id' otomatis
    patientData.patient_id = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Mengisi 'lama_rawat' dengan default 0 agar tidak error jika form kosong
    if (patientData.lama_rawat === undefined || patientData.lama_rawat === null) {
      patientData.lama_rawat = 0; 
    }

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