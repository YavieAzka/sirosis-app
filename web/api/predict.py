# File: api/predict.py
from http.server import BaseHTTPRequestHandler
import json
import pandas as pd
import joblib
import os
import shap
import numpy as np

# 1. Load model di luar fungsi agar di-cache (Cold Start Optimization)
base_dir = os.path.dirname(os.path.abspath(__file__))
# Naik satu folder ke root, lalu masuk ke deployment
model_path = os.path.join(base_dir, '..', 'deployment', 'model_rf_mortalitas_final.joblib')
features_path = os.path.join(base_dir, '..', 'deployment', 'daftar_fitur_m1.joblib')

# Load model dan daftar fitur
rf = joblib.load(model_path)
features = joblib.load(features_path)

# Inisialisasi SHAP Explainer menggunakan model yang sudah diload
explainer = shap.TreeExplainer(rf)

# 2. Vercel Serverless Handler
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Baca payload JSON dari Frontend Next.js
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            input_data = json.loads(post_data)
            
            # Format ke DataFrame
            df = pd.DataFrame([input_data])[features]
            
            # Prediksi probabilitas dan kelas absolut
            probabilitas = float(rf.predict_proba(df)[0][1])
            predicted_class = int(rf.predict(df)[0])
            
            # Ekstraksi SHAP Values untuk local interpretability (1 Pasien)
            shap_values = explainer.shap_values(df)
            
            # Random Forest scikit-learn mengembalikan list: [shap_kelas_0, shap_kelas_1]
            # Kita ambil indeks 1 (mortalitas) dan baris 0 (karena hanya 1 pasien)
            if isinstance(shap_values, list):
                patient_shap = shap_values[1][0]
                
                # Ambil base value untuk kelas 1
                base_val = explainer.expected_value[1] 
            else:
                # Fallback jika bentuk model berbeda (seperti XGBoost)
                patient_shap = shap_values[0]
                base_val = explainer.expected_value
                if isinstance(base_val, (list, np.ndarray)):
                    base_val = base_val[0]

            # Format nilai SHAP menjadi list of dictionary
            contributions = []
            for i, fname in enumerate(features):
                contributions.append({
                    "feature": fname,
                    "contribution": float(patient_shap[i]), # (+) mendorong ke kematian, (-) mencegah kematian
                    "value_input": float(df.iloc[0, i])
                })

            # Urutkan dari dampak (absolut) terbesar ke terkecil
            contributions = sorted(contributions, key=lambda x: abs(x['contribution']), reverse=True)
            
            # Siapkan payload respons yang lebih kaya
            response_payload = {
                "probability": probabilitas,
                "predicted_class": predicted_class,
                "base_value": float(base_val),
                "shap_contributions": contributions[:5]  # Ambil 5 faktor paling dominan saja untuk UI
            }
            
            # Kirim respons sukses
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_payload).encode('utf-8'))
            
        except Exception as e:
            # Kirim respons error
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))