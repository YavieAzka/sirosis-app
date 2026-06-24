# File: api/predict.py
from http.server import BaseHTTPRequestHandler
import json
import pandas as pd
import joblib
import os

# 1. Load model di luar fungsi agar di-cache (Cold Start Optimization)
base_dir = os.path.dirname(os.path.abspath(__file__))
# Naik satu folder ke root, lalu masuk ke deployment
model_path = os.path.join(base_dir, '..', 'deployment', 'model_rf_mortalitas_final.joblib')
features_path = os.path.join(base_dir, '..', 'deployment', 'daftar_fitur_m1.joblib')

rf = joblib.load(model_path)
features = joblib.load(features_path)

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
            
            # Prediksi probabilitas
            probabilitas = float(rf.predict_proba(df)[0][1])
            
            # Kirim respons sukses
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"probability": probabilitas}).encode('utf-8'))
            
        except Exception as e:
            # Kirim respons error
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))