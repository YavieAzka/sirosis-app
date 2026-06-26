# File: api/dose.py
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

# --- 2. RULE ENGINE (Dari script asli Anda) ---
def rekomendasi_diuretik(p: KondisiPasien) -> RekomendasiDosis:
    if p.gagal_ginjal_akut or p.hiperkalemia_berat:
        return RekomendasiDosis(obat="Diuretik (Spironolakton + Furosemide)", status="Hindari", rentang_dosis="Tidak diberikan", alasan="Gagal ginjal akut dan/atau hiperkalemia berat — kontraindikasi mutlak", sumber="data_rekan (diuretik_rekom_komorbid)", peringatan=["Hentikan terapi diuretik sampai kondisi akut teratasi"])
    if p.gfr < 30:
        return RekomendasiDosis(obat="Diuretik (Spironolakton + Furosemide)", status="Hindari", rentang_dosis="Tidak diberikan / dosis sangat rendah", alasan=f"GFR {p.gfr:.0f} mL/min (<30) — risiko hiperkalemia fatal dan HRS", sumber="data_rekan (diuretik_rekom_komorbid)", peringatan=["Pantau kalium serum dan fungsi ginjal sangat ketat bila tetap diberikan"])
    elif 30 <= p.gfr < 60:
        return RekomendasiDosis(obat="Diuretik (Spironolakton + Furosemide)", status="Kurangi Dosis 25-50%", rentang_dosis="Spironolakton 50-100 mg/hari + Furosemide 10-20 mg/hari", frekuensi="1x/hari", alasan=f"GFR {p.gfr:.0f} mL/min (30-59) — fungsi ginjal menurun sedang", sumber="data_rekan (diuretik_rekom_komorbid)", peringatan=["Pantau kalium serum dan kreatinin periodik"])
    else:
        return RekomendasiDosis(obat="Diuretik (Spironolakton + Furosemide)", status="Dosis Standar", rentang_dosis="Spironolakton 100-200 mg/hari + Furosemide 20-40 mg/hari", frekuensi="1x/hari", alasan=f"GFR {p.gfr:.0f} mL/min (≥60) — fungsi normal", sumber="data_rekan", peringatan=[])

def rekomendasi_betabloker(p: KondisiPasien) -> RekomendasiDosis:
    map_val = p.map_value
    map_threshold = 70 if p.ctp == 'C' else 65
    if p.ascites_refrakter and (map_val is not None and map_val < map_threshold):
        return RekomendasiDosis(obat="Beta-bloker (Propranolol)", status="Hindari", rentang_dosis="Tidak diberikan", alasan=f"Ascites refrakter dengan MAP {map_val:.0f} mmHg (<{map_threshold}) pada CTP-{p.ctp}", sumber="data_rekan", peringatan=["Risiko hipotensi berat dan precipitasi HRS"])
    if p.hrs:
        return RekomendasiDosis(obat="Beta-bloker (Propranolol)", status="Hindari", rentang_dosis="Tidak diberikan", alasan="Hepatorenal Syndrome aktif", sumber="data_rekan", peringatan=["Dapat memperburuk perfusi ginjal pada HRS"])
    if p.ctp == 'C':
        return RekomendasiDosis(obat="Beta-bloker (Propranolol)", status="Dosis Rendah, Titrasi Hati-hati", rentang_dosis="3.125-6.25 mg/hari", frekuensi="Titrasi perlahan", alasan="Child-Pugh C", sumber="data_rekan", peringatan=["Pantau TD ketat", "Hentikan bila MAP turun di bawah 70 mmHg"])
    elif p.ctp == 'B':
        return RekomendasiDosis(obat="Beta-bloker (Propranolol)", status="Dosis Awal Rendah", rentang_dosis="6.25-12.5 mg/hari", frekuensi="Titrasi bertahap", alasan="Child-Pugh B", sumber="data_rekan", peringatan=["Hentikan bila MAP turun di bawah 65 mmHg"])
    else:
        return RekomendasiDosis(obat="Beta-bloker (Propranolol)", status="Dosis Standar", rentang_dosis="10-20 mg/hari (awal), titrasi s/d 40 mg/hari", frekuensi="Titrasi hingga HR 55-60 bpm", alasan="Child-Pugh A", sumber="data_rekan", peringatan=["Hentikan bila MAP turun di bawah 65 mmHg"])

def rekomendasi_analgetik(p: KondisiPasien) -> RekomendasiDosis:
    bb = p.berat_badan
    pu = ["Hindari NSAID (ibuprofen, diklofenac)", "Parasetamol tetap butuh kehati-hatian (hepatotoksik dose-dependent)"]
    if p.ctp in ('A', 'B'):
        dosis = "Maksimal 2 g/hari" if bb is not None and bb < 50 else "Maksimal 3 g/hari"
        return RekomendasiDosis(obat="Analgetik (Parasetamol)", status="Dosis dengan Batas Maks", rentang_dosis=dosis, frekuensi="Terbagi", alasan=f"CTP {p.ctp}", sumber="literatur_disertasi", peringatan=pu)
    else:
        dosis = "Maksimal 1 g/hari" if bb is not None and bb < 50 else "Maksimal 1.5 g/hari"
        return RekomendasiDosis(obat="Analgetik (Parasetamol)", status="Kurangi Dosis 50%", rentang_dosis=dosis, frekuensi="Terbagi ketat", alasan="CTP C", sumber="literatur_disertasi", peringatan=pu+["Pantau ALT/AST berkala"])

def rekomendasi_antibiotik(p: KondisiPasien, jenis: str = "ampisilin_sulbaktam") -> RekomendasiDosis:
    if not p.ada_infeksi:
        return RekomendasiDosis(obat=f"Antibiotik ({jenis})", status="Tidak Diindikasikan", rentang_dosis="Tidak diberikan", alasan="Tidak ada infeksi aktif", sumber="literatur_disertasi")
    if jenis == "ampisilin_sulbaktam":
        if p.gfr < 30:
            return RekomendasiDosis(obat="Ampisilin-Sulbaktam", status="Kurangi Dosis", rentang_dosis="1.5 g per dosis", frekuensi="Interval diperpanjang (2x/hari)", alasan=f"GFR {p.gfr:.0f} — eliminasi renal terganggu", sumber="literatur_disertasi")
        return RekomendasiDosis(obat="Ampisilin-Sulbaktam", status="Dosis Standar", rentang_dosis="1.5-3 g per dosis", frekuensi="3-4x/hari", alasan="Fungsi ginjal adekuat", sumber="literatur_disertasi")
    elif jenis == "levofloxacin":
        if p.gfr < 30:
            return RekomendasiDosis(obat="Levofloxacin", status="Kurangi Dosis", rentang_dosis="500 mg", frekuensi="1x/hari (interval diperpanjang)", alasan=f"GFR {p.gfr:.0f}", sumber="literatur_disertasi")
        return RekomendasiDosis(obat="Levofloxacin", status="Dosis Standar", rentang_dosis="750 mg", frekuensi="1x/hari", alasan="Ginjal adekuat", sumber="literatur_disertasi")
    return RekomendasiDosis(obat=jenis, status="Belum Tersedia", rentang_dosis="N/A", alasan="Rule n<15 belum divalidasi", sumber="belum_tersedia")

def rekomendasi_lengkap(p: KondisiPasien, butuh_antibiotik: bool, jenis_antibiotik: str) -> dict:
    hasil = {'diuretik': rekomendasi_diuretik(p), 'betabloker': rekomendasi_betabloker(p), 'analgetik': rekomendasi_analgetik(p)}
    if butuh_antibiotik: hasil['antibiotik'] = rekomendasi_antibiotik(p, jenis_antibiotik)
    return hasil

# --- 3. VERCEL SERVERLESS HANDLER ---
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data)

            # Mapping input frontend ke KondisiPasien
            p = KondisiPasien(
                gfr=float(body.get('gfr', 0)),
                ctp=body.get('ctp', 'A'),
                map_value=float(body['map_value']) if body.get('map_value') else None,
                ascites_refrakter=bool(int(body.get('ascites_refrakter', 0))),
                hrs=bool(int(body.get('hrs', 0))),
                gagal_ginjal_akut=bool(int(body.get('gagal_ginjal_akut', 0))),
                hiperkalemia_berat=bool(int(body.get('hiperkalemia_berat', 0))),
                berat_badan=float(body['berat_badan']) if body.get('berat_badan') else None,
                ada_infeksi=bool(int(body.get('ada_infeksi', 0)))
            )

            butuh_ab = bool(int(body.get('butuh_antibiotik', 0)))
            jenis_ab = body.get('jenis_antibiotik', 'ampisilin_sulbaktam')

            hasil = rekomendasi_lengkap(p, butuh_antibiotik=butuh_ab, jenis_antibiotik=jenis_ab)
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