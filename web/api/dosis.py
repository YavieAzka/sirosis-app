# File: api/dosis.py
from http.server import BaseHTTPRequestHandler
import json
from dataclasses import dataclass, field
from typing import Optional

# ═══════════════════════════════════════════════════════════
# STRUKTUR DATA
# ═══════════════════════════════════════════════════════════

@dataclass
class KondisiPasien:
    gfr: float                          
    ctp: str                            
    map_value: Optional[float] = None   
    ascites_refrakter: bool = False
    hrs: bool = False                   
    gagal_ginjal_akut: bool = False     
    sepsis_pneumonia: bool = False      
    ast_alt_tinggi: bool = False        


@dataclass
class RekomendasiDosis:
    obat: str
    status: str               
    rentang_dosis: str        
    alasan: str = ""
    peringatan: list = field(default_factory=list)

    def to_dict(self):
        return {
            'obat': self.obat, 'status': self.status,
            'rentang_dosis': self.rentang_dosis,
            'alasan': self.alasan,
            'peringatan': self.peringatan
        }

# ═══════════════════════════════════════════════════════════
# RULE ENGINE 8 OBAT
# ═══════════════════════════════════════════════════════════

def rekom_spiro_furo(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Pantau: Na+, K+, Cr, output urin, BB harian, TD. Stop criteria: Na+<125, K+>5.5, Cr naik >30%, hipotensi berat."]
    status, dosis, alasan = "Monitor/Reduce", "", ""

    if p.gagal_ginjal_akut or p.hrs:
        peringatan.append("AKI/CKD/HRS: Kombinasi dapat memperparah gagal ginjal -> gunakan setelah stabilisasi hemodinamik.")
    if p.sepsis_pneumonia:
        peringatan.append("Sepsis/Pneumonia: Hentikan sementara bila hemodinamik labil.")

    if p.gfr < 30:
        status = "Avoid / Dosis Sangat Rendah"
        dosis = "Hindari atau dosis sangat rendah"
        alasan = "GFR <30 mL/min: risiko HRS tinggi."
    elif 30 <= p.gfr < 60:
        status = "Reduce (25-50%)"
        dosis = "Spironolactone 50-100 mg/hari + Furosemide 10-20 mg/hari"
        alasan = "GFR menurun (30-59 mL/min)."
    else:
        if p.ctp == 'C':
            status = "Avoid / Paracentesis"
            dosis = "Spironolactone 25-50 mg/hari + Furosemide 10 mg/hari"
            alasan = "Child-Pugh C: Risiko tinggi ensefalopati & HRS. Hindari jika tidak perlu, preferensi paracentesis."
        elif p.ctp == 'B':
            dosis = "Spironolactone 50-100 mg/hari + Furosemide 10-20 mg/hari"
            alasan = "Child-Pugh B. Hati-hati hiponatremia; gunakan jika respons parsial."
        else:
            status = "Use (Dosis Standar)"
            dosis = "Spironolactone 100-200 mg/hari + Furosemide 20-40 mg/hari"
            alasan = "Fungsi hati (CTP A) dan ginjal adekuat."

    return RekomendasiDosis("Spironolactone + Furosemide (Kombinasi)", status, dosis, alasan, peringatan)


def rekom_spironolakton(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Pantau: K+, Na+, Cr, TD, status volume. Stop criteria: K+>5.5, Cr naik >30% baseline, dehidrasi, HE meningkat."]
    status, dosis, alasan = "Monitor/Reduce", "", ""

    if p.gagal_ginjal_akut or p.hrs:
        peringatan.append("AKI/CKD/HRS: risiko hiperkalemia meningkat -> hati-hati.")
    if p.sepsis_pneumonia:
        peringatan.append("Sepsis/Pneumonia: hentikan sementara bila hipotensi atau AKI.")

    if p.gfr < 30:
        status = "Avoid"
        dosis = "Hindari"
        alasan = "GFR <30 mL/min: risiko hiperkalemia fatal."
    elif 30 <= p.gfr < 60:
        status = "Reduce (25-50%)"
        dosis = "50-100 mg/hari"
        alasan = "GFR menurun (30-59 mL/min)."
    else:
        if p.ctp == 'C':
            dosis = "25-50 mg/hari"
            alasan = "Child-Pugh C."
        elif p.ctp == 'B':
            dosis = "50-100 mg/hari"
            alasan = "Child-Pugh B."
        else:
            status = "Use (Dosis Standar)"
            dosis = "100-200 mg/hari"
            alasan = "Fungsi hati (CTP A) dan ginjal adekuat."

    return RekomendasiDosis("Spironolakton", status, dosis, alasan, peringatan)


def rekom_furosemid(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Pantau: Na+, K+, Cr, output urin, BB, TD. Stop criteria: Na+<125, Cr naik >30%, hipotensi, oliguria <500 mL/24 jam."]
    status, dosis, alasan = "Monitor/Reduce", "", ""

    if p.hrs and not p.ascites_refrakter:
        status = "Avoid"
        peringatan.append("Hindari bila HRS aktif tanpa respon albumin/vasokonstriktor.")
    if p.gagal_ginjal_akut:
        peringatan.append("AKI/CKD/HRS: risiko gagal ginjal prerenal. Pada AKI gunakan intermiten atau hentikan.")
    if p.sepsis_pneumonia:
        peringatan.append("Sepsis/Pneumonia: hentikan bila hipotensi/oliguria.")

    if p.gfr < 30:
        status = "Avoid"
        dosis = "Hindari"
        alasan = "GFR <30 mL/min: risiko toksisitas otot (rhabdomyolysis) tinggi."
    elif 30 <= p.gfr < 60:
        status = "Reduce (25-50%)"
        dosis = "10-20 mg/hari"
        alasan = "GFR menurun (30-59 mL/min)."
    else:
        if p.ctp == 'C':
            status = "Avoid / Dosis Rendah"
            dosis = "10 mg/hari atau hindari"
            alasan = "Child-Pugh C."
        elif p.ctp == 'B':
            dosis = "10-20 mg/hari"
            alasan = "Child-Pugh B."
        else:
            status = "Use (Dosis Standar)"
            dosis = "20-40 mg/hari"
            alasan = "Fungsi hati (CTP A) dan ginjal adekuat."

    return RekomendasiDosis("Furosemid", status, dosis, alasan, peringatan)


def rekom_propranolol(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Pantau: HR, MAP, Cr, Na+, tanda dekompensasi. Stop criteria: HR <55 bpm, MAP <65 mmHg, Na+<125, Cr naik >30%."]
    status, dosis, alasan = "Monitor/Reduce", "", ""

    if p.gagal_ginjal_akut or p.hrs:
        peringatan.append("AKI/HRS: dapat memperburuk perfusi ginjal -> hindari.")
    if p.sepsis_pneumonia:
        peringatan.append("Sepsis/Pneumonia: hentikan sementara bila tekanan darah rendah.")
    if p.gfr < 60:
        peringatan.append("GFR menurun: mulai rendah, titrasi pelan; hentikan jika ada bukti AKI.")

    if p.ctp == 'C' or p.hrs or (p.map_value and p.map_value < 65) or p.ascites_refrakter:
        status = "Avoid"
        dosis = "Umumnya hindari"
        pemicu = []
        if p.ctp == 'C':
            pemicu.append("Child-Pugh C")
        if p.ascites_refrakter:
            pemicu.append("asites refrakter")
        if p.hrs:
            pemicu.append("HRS")
        if p.map_value and p.map_value < 65:
            pemicu.append(f"MAP {p.map_value} mmHg (< 65 mmHg)")
        alasan = ", ".join(pemicu) + "."
    elif p.ctp == 'B':
        status = "Monitor/Reduce"
        dosis = "10 - 20 mg/hari, titrasi perlahan"
        alasan = "Child-Pugh B."
    else:
        status = "Use"
        dosis = "Dosis awal 20 - 40 mg/hari"
        alasan = "Child-Pugh A. Titrasi hingga HR 55 - 60 bpm atau 25% turun dari baseline."

    return RekomendasiDosis("Propranolol", status, dosis, alasan, peringatan)


def rekom_carvedilol(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Pantau: MAP, HR, Cr, Na+, gejala hipotensi. Stop criteria: MAP <70 mmHg, HR <55 bpm, Cr naik >30%, HE/hiponatremia berat."]
    status, dosis, alasan = "Monitor/Reduce", "", ""

    if p.gagal_ginjal_akut or p.hrs:
        peringatan.append("AKI/HRS: risiko penurunan perfusi renal lebih tinggi daripada propranolol.")
    if p.sepsis_pneumonia:
        peringatan.append("Sepsis/Pneumonia: hentikan sementara bila infeksi berat atau hipotensi.")
    if p.gfr < 60:
        peringatan.append("GFR menurun: mulai rendah, titrasi pelan; hentikan jika ada bukti AKI.")

    if p.ctp == 'C' or p.hrs or (p.map_value and p.map_value < 70) or p.ascites_refrakter:
        status = "Avoid"
        dosis = "Hindari"
        pemicu = []
        if p.ctp == 'C':
            pemicu.append("Child-Pugh C")
        if p.ascites_refrakter:
            pemicu.append("asites refrakter")
        if p.hrs:
            pemicu.append("HRS")
        if p.map_value and p.map_value < 70:
            pemicu.append(f"MAP {p.map_value} mmHg (< 70 mmHg)")
        alasan = ", ".join(pemicu) + "."
    elif p.ctp == 'B':
        status = "Monitor/Reduce"
        dosis = "3.125 - 6.25 mg/hari"
        alasan = "Child-Pugh B. Pantau tekanan darah dan fungsi ginjal."
    else:
        status = "Use"
        dosis = "Dosis awal 6.25 mg/hari"
        alasan = "Child-Pugh A. Titrasi hingga 12.5 mg/hari jika toleran."

    return RekomendasiDosis("Carvedilol", status, dosis, alasan, peringatan)


def rekom_ampisilin_sulbaktam(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Monitor Cr, fungsi hati; hentikan bila AKI atau cholestasis berat."]
    status, dosis, alasan = "Use / Reduce if CKD", "", ""

    if p.gfr >= 30:
        dosis = "1,5 - 3 g IV tiap 6 jam (dosis standar)"
        alasan = "Fungsi ginjal memadai (CrCl >= 30 mL/min)."
    elif 15 <= p.gfr < 30:
        dosis = "1,5 - 3 g IV tiap 12 jam"
        alasan = "Fungsi ginjal menurun (CrCl 15-29 mL/min)."
    else:
        dosis = "1,5 - 3 g IV tiap 24 jam"
        alasan = "Fungsi ginjal menurun berat (CrCl < 15 mL/min)."

    if p.ctp == 'C' and p.gfr < 30:
        dosis += " (Reduce dose 50% karena Child C & CrCl < 30)"

    return RekomendasiDosis("Ampisilin-Sulbaktam", status, dosis, alasan, peringatan)


def rekom_azitromisin(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Monitor AST/ALT, bilirubin; hentikan bila transaminase naik > 3x atau pruritus/hepatitis."]
    status, dosis, alasan = "Use / Monitor", "", "Tidak perlu penyesuaian renal."

    if p.ctp == 'C':
        status = "Avoid"
        dosis = "Hindari jika memungkinkan (gunakan alternatif). Jika digunakan, maksimal 250 mg/hari."
        alasan += " Child-Pugh C."
    elif p.ctp == 'B':
        if p.ast_alt_tinggi:
            status = "Reduce"
            dosis = "Kurangi dosis 25-50%"
            alasan += " Child-Pugh B dengan AST/ALT > 2x normal."
        else:
            dosis = "500 mg/hari (Dosis standar)"
            alasan += " Child-Pugh B dengan enzim hati stabil."
    else:
        status = "Use"
        dosis = "500 mg/hari (Dosis standar)"
        alasan += " Child-Pugh A."

    return RekomendasiDosis("Azitromisin", status, dosis, alasan, peringatan)


def rekom_levofloxacin(p: KondisiPasien) -> RekomendasiDosis:
    peringatan = ["Monitor Cr, QT interval, Ensefalopati; hentikan bila delirium/ensefalopati."]
    status, dosis, alasan = "Reduce / Monitor", "", ""

    if p.ctp == 'C' and (p.gfr < 30 or p.gagal_ginjal_akut):
        status = "Avoid"
        dosis = "Hindari"
        alasan = "Child-Pugh C dengan CrCl < 30 atau AKI aktif."
    elif p.ctp == 'B':
        status = "Reduce / Avoid"
        dosis = "Kurangi dosis atau hindari jika ada riwayat hepatotoksisitas."
        alasan = "Child-Pugh B (risiko ensefalopati/perdarahan GI meningkat)."
    else:
        status = "Use / Monitor"
        dosis = "Dosis standar (berdasarkan CrCl)"
        alasan = "Child-Pugh A, monitor enzim hati."

    if status != "Avoid":
        if p.gfr >= 50:
            dosis += " -> 500 mg/hari"
        elif 20 <= p.gfr < 50:
            dosis += " -> 250 mg/hari"
        else:
            dosis += " -> 250 mg setiap 48 jam (hindari jika hemodialisis)"

    return RekomendasiDosis("Levofloxacin", status, dosis, alasan, peringatan)


# ═══════════════════════════════════════════════════════════
# VERCEL SERVERLESS HANDLER
# ═══════════════════════════════════════════════════════════

def rekomendasi_lengkap(p: KondisiPasien, obat_pilihan: list) -> dict:
    """Eksekusi rule hanya untuk obat yang diminta."""
    hasil = {}
    
    # Pemetaan (mapping) ID obat ke fungsi masing-masing
    aturan_obat = {
        'spiro_furo': rekom_spiro_furo,
        'spironolakton': rekom_spironolakton,
        'furosemid': rekom_furosemid,
        'propranolol': rekom_propranolol,
        'carvedilol': rekom_carvedilol,
        'ampisilin_sulbaktam': rekom_ampisilin_sulbaktam,
        'azitromisin': rekom_azitromisin,
        'levofloxacin': rekom_levofloxacin
    }

    for obat_id in obat_pilihan:
        if obat_id in aturan_obat:
            hasil[obat_id] = aturan_obat[obat_id](p)

    if not hasil:
        return {"info": RekomendasiDosis(obat="Tidak ada obat dipilih", status="N/A", rentang_dosis="N/A", alasan="Silakan pilih minimal satu obat pada formulir.").to_dict()}
    
    return hasil

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data)

            obat_pilihan = body.get('obat_pilihan', [])

            p = KondisiPasien(
                gfr=float(body.get('gfr', 0)),
                ctp=body.get('ctp', 'A'),
                map_value=float(body['map_value']) if body.get('map_value') else None,
                ascites_refrakter=bool(int(body.get('ascites_refrakter', 0))),
                hrs=bool(int(body.get('hrs', 0))),
                gagal_ginjal_akut=bool(int(body.get('gagal_ginjal_akut', 0))),
                sepsis_pneumonia=bool(int(body.get('sepsis_pneumonia', 0))),
                ast_alt_tinggi=bool(int(body.get('ast_alt_tinggi', 0)))
            )

            hasil = rekomendasi_lengkap(p, obat_pilihan)
            
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