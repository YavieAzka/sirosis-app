import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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