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
model_path = os.path.join(base_dir, '..', 'deployment', 'model_rf_mortalitas_final.joblib')
features_path = os.path.join(base_dir, '..', 'deployment', 'daftar_fitur_m1.joblib')

# Load model dan daftar fitur
rf = joblib.load(model_path)
features = joblib.load(features_path)

# Inisialisasi SHAP Explainer
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
            
            # Ekstraksi SHAP Values
            shap_values = explainer.shap_values(df)
            
            # --- PERBAIKAN LOGIKA DIMENSI (ANTI-ERROR) ---
            if isinstance(shap_values, list):
                # Format SHAP Lama (List of arrays)
                patient_shap = shap_values[1][0]
                base_val = explainer.expected_value[1]
                
            elif isinstance(shap_values, np.ndarray):
                if len(shap_values.shape) == 3:
                    # Format SHAP Baru (3D Array: [samples, features, classes])
                    # Kita ambil: sample 0, semua fitur (:), kelas 1 (mortalitas)
                    patient_shap = shap_values[0, :, 1]
                    base_val = explainer.expected_value[1] if isinstance(explainer.expected_value, (list, np.ndarray)) else explainer.expected_value
                else:
                    # Format Fallback (XGBoost / Binary Mode: 2D Array [samples, features])
                    patient_shap = shap_values[0]
                    base_val = explainer.expected_value[1] if isinstance(explainer.expected_value, (list, np.ndarray)) and len(explainer.expected_value) > 1 else explainer.expected_value
            
            # Pengamanan Ekstra: Pastikan base_val adalah skalar tunggal
            if isinstance(base_val, np.ndarray):
                base_val = base_val.item() if base_val.size == 1 else base_val[0]
            elif isinstance(base_val, list):
                base_val = base_val[0]
            # --------------------------------------------

            # Format nilai SHAP menjadi list of dictionary
            contributions = []
            for i, fname in enumerate(features):
                contributions.append({
                    "feature": fname,
                    "contribution": float(patient_shap[i]), # Karena pemotongan array sudah benar, array ini berisi skalar
                    "value_input": float(df.iloc[0, i])
                })

            # Urutkan dari dampak (absolut) terbesar ke terkecil
            contributions = sorted(contributions, key=lambda x: abs(x['contribution']), reverse=True)
            
            # Siapkan payload respons
            response_payload = {
                "probability": probabilitas,
                "predicted_class": predicted_class,
                "base_value": float(base_val),
                "shap_contributions": contributions[:5] 
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