import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Stringify dan escape tanda kutip agar aman dilempar ke Command Line
    const inputString = JSON.stringify(body).replace(/"/g, '\\"');
    
    // Panggil skrip Python. Catatan: Ubah 'python' menjadi 'python3' jika Anda menggunakan macOS/Linux
    const { stdout, stderr } = await execPromise(`python predict_bridge.py "${inputString}"`);
    
    if (stderr) {
      console.warn('Python Stderr (Abaikan jika hanya warning):', stderr);
    }

    const result = JSON.parse(stdout);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ probability: result.probability });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Gagal mengeksekusi model Python' }, { status: 500 });
  }
}