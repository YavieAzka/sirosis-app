# File: api/predict_los.py
from http.server import BaseHTTPRequestHandler
import json
import pandas as pd
import numpy as np
import joblib
import os

# 1. Load model di luar fungsi agar di-cache (Cold Start Optimization)
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, '..', 'deployment', 'model_rf_los_final.joblib')
features_path = os.path.join(base_dir, '..', 'deployment', 'daftar_fitur_m2_los.joblib')

rf_los = joblib.load(model_path)
features = joblib.load(features_path)

# Fungsi kalkulasi MELD dinamis
def hitung_meld_dinamis(bilirubin, inr, kreatinin):
    bil = max(float(bilirubin), 1.0)
    inr_v = max(float(inr), 1.0)
    kre = max(float(kreatinin), 1.0)
    kre = min(kre, 4.0) # Cap di 4.0 sesuai standar UNOS (misal pasien dialisis)
    return round(3.78 * np.log(bil) + 11.2 * np.log(inr_v) + 9.57 * np.log(kre) + 6.43, 1)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Baca payload JSON dari Frontend Next.js
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            input_data = json.loads(post_data)
            
            # Ekstrak komponen pembentuk MELD dari payload
            bil = float(input_data.get('bilirubin_baseline', 1.0))
            inr = float(input_data.get('inr_baseline', 1.0))
            kre = float(input_data.get('kreatinin_baseline', 1.0))
            
            # Hitung dan suntikkan meld_score ke dalam dictionary input_data
            input_data['meld_score'] = hitung_meld_dinamis(bil, inr, kre)
            
            # Format ke DataFrame dan pastikan urutan kolom sesuai dengan saat training
            df = pd.DataFrame([input_data])[features]
            
            # Prediksi probabilitas Lama Rawat (> 7 hari)
            probabilitas = float(rf_los.predict_proba(df)[0][1])
            
            # Kirim respons sukses
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"probability_los": probabilitas}).encode('utf-8'))
            
        except Exception as e:
            # Kirim respons error
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))