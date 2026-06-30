# File: api/dosis.py
from http.server import BaseHTTPRequestHandler
import json
from dataclasses import dataclass, field
from typing import Optional

# --- 1. STRUKTUR DATA ---
@dataclass
class KondisiPasien:
    gfr: float
    ctp: str
    map_value: Optional[float] = None
    ascites_refrakter: bool = False
    hrs: bool = False
    gagal_ginjal_akut: bool = False
    hiperkalemia_berat: bool = False
    berat_badan: Optional[float] = None
    ada_infeksi: bool = False

@dataclass
class RekomendasiDosis:
    obat: str
    status: str
    rentang_dosis: str
    frekuensi: Optional[str] = None
    alasan: str = ""
    sumber: str = ""
    peringatan: list = field(default_factory=list)

    def to_dict(self):
        return {
            'obat': self.obat, 'status': self.status,
            'rentang_dosis': self.rentang_dosis, 'frekuensi': self.frekuensi,
            'alasan': self.alasan, 'sumber': self.sumber,
            'peringatan': self.peringatan
        }

# --- 2. RULE ENGINE ---
def rekomendasi_diuretik(p: KondisiPasien) -> RekomendasiDosis:
    if p.gagal_ginjal_akut or p.hrs or p.hiperkalemia_berat:
        return RekomendasiDosis(obat="Diuretik (Spironolactone + Furosemide)", status="Hindari / Hentikan Sementara", rentang_dosis="Tidak diberikan", alasan="AKI, HRS, atau Hiperkalemia memicu perburukan ginjal fatal.", sumber="Matriks Keputusan (Decicision for penelitian.xlsx)", peringatan=["Gunakan setelah stabilisasi hemodinamik", "Hentikan sementara bila hemodinamik labil (Sepsis/Pneumonia)"])
    if p.gfr < 30:
        return RekomendasiDosis(obat="Diuretik (Spironolactone + Furosemide)", status="Hindari / Dosis Sangat Rendah", rentang_dosis="Hindari / Dosis sangat rendah", alasan=f"GFR {p.gfr:.0f} mL/min (<30) — risiko HRS tinggi", sumber="Matriks Keputusan (Decicision for penelitian.xlsx)", peringatan=["Pantau Na+, K+, Cr, tekanan darah ketat", "Stop kriteria: Na+ < 125, K+ > 5.5, Cr naik > 30%"])
    if p.ctp == 'C':
        dosis, alasan = "Spironolactone 25-50 mg/hari + Furosemide 10 mg/hari (atau hindari)", "Child-Pugh C — Risiko tinggi ensefalopati dan HRS"
    elif p.ctp == 'B':
        dosis, alasan = "Spironolactone 50-100 mg/hari + Furosemide 10-20 mg/hari", "Child-Pugh B — Hati-hati hiponatremia, gunakan jika respons parsial"
    else:
        dosis, alasan = "Spironolactone 100-200 mg/hari + Furosemide 20-40 mg/hari", "Child-Pugh A — Dosis standar (Rasio ideal 100:40)"
        
    if 30 <= p.gfr < 60:
        alasan += f" | Penyesuaian GFR {p.gfr:.0f}: Kurangi dosis 25-50%"
        status = "Kurangi Dosis (25-50%)"
    else:
        status = "Dosis Sesuai Kelas CTP"
        
    return RekomendasiDosis(obat="Diuretik (Spironolactone + Furosemide)", status=status, rentang_dosis=dosis, frekuensi="1x/hari", alasan=alasan, sumber="Matriks Keputusan (Decicision for penelitian.xlsx)", peringatan=["Pantau berat badan harian, Na+, K+, dan Cr", "Stop criteria: Na+ < 125, K+ > 5.5, Cr naik > 30%, hipotensi berat"])

def rekomendasi_betabloker(p: KondisiPasien, jenis: str = "propranolol") -> RekomendasiDosis:
    map_val = p.map_value
    if p.hrs or p.gagal_ginjal_akut:
        return RekomendasiDosis(obat=f"Beta-bloker ({jenis.capitalize()})", status="Hindari", rentang_dosis="Tidak diberikan", alasan="AKI/HRS aktif: dapat memperburuk perfusi ginjal", sumber="Matriks Keputusan", peringatan=["Hentikan sementara pada Sepsis/Pneumonia bila hemodinamik labil"])
        
    if jenis == "carvedilol":
        if p.ctp == 'C' and (p.ascites_refrakter or p.hrs or (map_val and map_val < 70)): return RekomendasiDosis(obat="Carvedilol", status="Hindari", rentang_dosis="Tidak diberikan", alasan=f"Child C dengan Asites Refrakter/HRS/MAP<70 (MAP terukur: {map_val})", sumber="Matriks Keputusan", peringatan=["Risiko penurunan perfusi renal lebih tinggi dari propranolol"])
        if p.ctp == 'C': return RekomendasiDosis(obat="Carvedilol", status="Avoid / Monitor Ketat", rentang_dosis="Tidak direkomendasikan", alasan="Child-Pugh C", sumber="Matriks Keputusan")
        elif p.ctp == 'B': return RekomendasiDosis(obat="Carvedilol", status="Reduce / Monitor", rentang_dosis="3.125 - 6.25 mg/hari", alasan="Child-Pugh B (Bila stabil)", sumber="Matriks Keputusan", peringatan=["Stop jika MAP < 70 mmHg", "Pantau Cr, Na+"])
        else: return RekomendasiDosis(obat="Carvedilol", status="Dosis Standar", rentang_dosis="Awal 6.25 mg/hari, titrasi s/d 12.5 mg/hari", alasan="Child-Pugh A", sumber="Matriks Keputusan", peringatan=["Stop jika MAP < 70 mmHg", "HR < 55 bpm"])
    else:
        if p.ascites_refrakter or p.hrs or (map_val and map_val < 65): return RekomendasiDosis(obat="Propranolol", status="Hindari", rentang_dosis="Tidak diberikan", alasan=f"Asites refrakter / MAP < 65 (MAP terukur: {map_val})", sumber="Matriks Keputusan", peringatan=["Risiko hipotensi dan gagal ginjal"])
        if p.ctp == 'C': return RekomendasiDosis(obat="Propranolol", status="Avoid", rentang_dosis="Umumnya hindari", alasan="Child-Pugh C", sumber="Matriks Keputusan")
        elif p.ctp == 'B': return RekomendasiDosis(obat="Propranolol", status="Reduce / Monitor", rentang_dosis="10 - 20 mg/hari", frekuensi="Titrasi perlahan", alasan="Child-Pugh B", sumber="Matriks Keputusan", peringatan=["Stop bila MAP < 65 mmHg"])
        else: return RekomendasiDosis(obat="Propranolol", status="Dosis Standar", rentang_dosis="Awal 20-40 mg/hari, titrasi hingga HR 55-60 bpm", alasan="Child-Pugh A", sumber="Matriks Keputusan", peringatan=["Stop bila MAP < 65 mmHg", "HR turun >25% baseline"])

def rekomendasi_analgetik(p: KondisiPasien) -> RekomendasiDosis:
    bb = p.berat_badan
    pu = ["Hindari NSAID (ibuprofen, diklofenac)", "Parasetamol tetap butuh kehati-hatian"]
    if p.ctp in ('A', 'B'): return RekomendasiDosis(obat="Analgetik (Parasetamol)", status="Dosis dengan Batas Maks", rentang_dosis="Maksimal 2 g/hari" if bb is not None and bb < 50 else "Maksimal 3 g/hari", frekuensi="Terbagi", alasan=f"CTP {p.ctp}", sumber="Literatur Draf Disertasi", peringatan=pu)
    else: return RekomendasiDosis(obat="Analgetik (Parasetamol)", status="Kurangi Dosis 50%", rentang_dosis="Maksimal 1 g/hari" if bb is not None and bb < 50 else "Maksimal 1.5 g/hari", frekuensi="Terbagi ketat", alasan="CTP C", sumber="Literatur Draf Disertasi", peringatan=pu+["Pantau ALT/AST berkala"])

def rekomendasi_antibiotik(p: KondisiPasien, jenis: str = "ampisilin_sulbaktam") -> RekomendasiDosis:
    if not p.ada_infeksi: return RekomendasiDosis(obat=f"Antibiotik ({jenis})", status="Tidak Diindikasikan", rentang_dosis="Tidak diberikan", alasan="Tidak ada indikasi infeksi aktif", sumber="Matriks Keputusan")
    if jenis == "ampisilin_sulbaktam":
        if p.gfr >= 30: dosis, freq = "1.5 - 3 g IV", "Tiap 6 jam (q6h)"
        elif 15 <= p.gfr < 30: dosis, freq = "1.5 - 3 g IV", "Tiap 12 jam (q12h) [CrCl 15-29]"
        else: dosis, freq = "1.5 - 3 g IV", "Tiap 24 jam (q24h) [CrCl 5-14]"
        if p.gfr < 30 and p.ctp == 'C': dosis += " (Reduce dose 50% untuk Child C)"
        return RekomendasiDosis(obat="Ampisilin-Sulbaktam", status="Use / Reduce if CKD", rentang_dosis=dosis, frekuensi=freq, alasan=f"Penyesuaian interval berdasarkan CrCl (GFR {p.gfr:.0f})", sumber="Matriks Keputusan", peringatan=["Monitor Cr dan fungsi hati", "Hentikan bila AKI atau cholestasis berat"])
    elif jenis == "azitromisin":
        if p.ctp == 'C': return RekomendasiDosis(obat="Azitromisin", status="Avoid / Reduce", rentang_dosis="Maks 250 mg/hari (Bila darurat)", alasan="Child C: Hindari jika memungkinkan, gunakan alternatif (misal siprofloksasin)", sumber="Matriks Keputusan")
        elif p.ctp == 'B': return RekomendasiDosis(obat="Azitromisin", status="Use / Monitor", rentang_dosis="Kurangi 25-50% (jika AST/ALT > 2x normal)", alasan="Child B: Eliminasi hepatik dominan", sumber="Matriks Keputusan", peringatan=["Hentikan bila transaminase naik > 3x atau pruritus"])
        else: return RekomendasiDosis(obat="Azitromisin", status="Use", rentang_dosis="500 mg QD", alasan="Child A (Tidak perlu penyesuaian renal)", sumber="Matriks Keputusan", peringatan=[])
    elif jenis == "levofloxacin":
        if p.ctp == 'C' and (p.gfr < 30 or p.gagal_ginjal_akut): return RekomendasiDosis(obat="Levofloxacin", status="Avoid", rentang_dosis="Hindari", alasan=f"Child C dengan CrCl <30 / AKI", sumber="Matriks Keputusan")
        if p.gfr >= 50: dosis = "500 mg/hari"
        elif 20 <= p.gfr < 50: dosis = "250 mg/hari"
        else: dosis = "250 mg setiap 48 jam (Hindari jika hemodialisis)"
        return RekomendasiDosis(obat="Levofloxacin", status="Reduce / Monitor", rentang_dosis=dosis, alasan=f"Ekskresi renal dominan (GFR {p.gfr:.0f}), Sesuaikan berdasar CrCl", sumber="Matriks Keputusan", peringatan=["Monitor Cr, QT interval, Ensefalopati Hepar", "Hentikan bila delirium/ensefalopati"])
    return RekomendasiDosis(obat=jenis, status="Belum Tersedia", rentang_dosis="N/A", alasan="Data tidak ada", sumber="")

def rekomendasi_lengkap(p: KondisiPasien, obat_pilihan: list, jenis_antibiotik: str, jenis_betabloker: str) -> dict:
    hasil = {}
    if 'diuretik' in obat_pilihan:
        hasil['diuretik'] = rekomendasi_diuretik(p)
    if 'betabloker' in obat_pilihan:
        hasil['betabloker'] = rekomendasi_betabloker(p, jenis_betabloker)
    if 'analgetik' in obat_pilihan:
        hasil['analgetik'] = rekomendasi_analgetik(p)
    if 'antibiotik' in obat_pilihan:
        hasil['antibiotik'] = rekomendasi_antibiotik(p, jenis_antibiotik)
    
    # Jika tidak ada yang dipilih sama sekali, berikan peringatan
    if not hasil:
        return {"info": RekomendasiDosis(obat="Tidak ada obat dipilih", status="N/A", rentang_dosis="N/A", alasan="Silakan centang minimal satu obat pada formulir.").to_dict()}
    return hasil

# --- 3. VERCEL SERVERLESS HANDLER ---
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data)

            # Ambil daftar obat yang dipilih dari frontend
            obat_pilihan = body.get('obat_pilihan', ['diuretik', 'betabloker', 'analgetik'])

            p = KondisiPasien(
                gfr=float(body.get('gfr', 0)),
                ctp=body.get('ctp', 'A'),
                map_value=float(body['map_value']) if body.get('map_value') else None,
                ascites_refrakter=bool(int(body.get('ascites_refrakter', 0))),
                hrs=bool(int(body.get('hrs', 0))),
                gagal_ginjal_akut=bool(int(body.get('gagal_ginjal_akut', 0))),
                hiperkalemia_berat=bool(int(body.get('hiperkalemia_berat', 0))),
                berat_badan=float(body['berat_badan']) if body.get('berat_badan') else None,
                ada_infeksi=bool(1) if 'antibiotik' in obat_pilihan else bool(0) 
            )

            jenis_ab = body.get('jenis_antibiotik', 'ampisilin_sulbaktam')
            jenis_bb = body.get('jenis_betabloker', 'propranolol')

            hasil = rekomendasi_lengkap(p, obat_pilihan=obat_pilihan, jenis_antibiotik=jenis_ab, jenis_betabloker=jenis_bb)
            
            # Jika hasil mengembalikan dictionary 'info', langsung kirim
            if 'info' in hasil:
                hasil_json = hasil
            else:
                hasil_json = {k: v.to_dict() for k, v in hasil.items()}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(hasil_json).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))