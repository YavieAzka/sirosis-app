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
    // SISTEM KEAMANAN & ANTI-INJEKSI
    // ==========================================
    const validToken = process.env.SAVE_TOKEN;
    
    // Pengecekan komparasi identitas absolut (===)
    // Mustahil di-bypass menggunakan injeksi string
    if (!validToken || body.token !== validToken) {
      return NextResponse.json(
        { error: 'Akses Ditolak: Token otorisasi tidak valid atau kosong.' }, 
        { status: 401 }
      );
    }
    // ==========================================

    const prisma = getPrisma();
    // Konversi CTP dari angka (1/2/3) menjadi huruf (A/B/C) sesuai skema
    const ctpMap: { [key: number]: string } = { 1: 'A', 2: 'B', 3: 'C' };
    const ctpString = ctpMap[body.ctp_encoded] || 'A';

    // Generate ID unik untuk pasien baru
    const generatedId = `TEST-${Date.now()}`;

    const newPatient = await prisma.patient.create({
      data: {
        patient_id: generatedId,
        komor_sepsis: body.komor_sepsis,
        urea_baseline: body.urea_baseline,
        natrium_baseline: body.natrium_baseline,
        komp_eh: body.komp_eh,
        inr_baseline: body.inr_baseline,
        sgot_baseline: body.sgot_baseline,
        gfr: body.gfr,
        ctp: ctpString,
        lama_rawat: 0, // Wajib diisi 0 karena di Prisma bertipe Int (non-nullable)
      }
    });

    return NextResponse.json({ success: true, data: newPatient });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan ke database Supabase' }, { status: 500 });
  }
}