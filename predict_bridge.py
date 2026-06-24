import sys
import json
import pandas as pd
import joblib
import warnings

warnings.filterwarnings('ignore')

def main():
    try:
        # Baca input JSON dari argument Node.js
        input_data = json.loads(sys.argv[1])
        
        # Load model dan urutan fitur dari folder 'deployment'
        rf = joblib.load('deployment/model_rf_mortalitas_final.joblib')
        features = joblib.load('deployment/daftar_fitur_m1.joblib')
        
        # Konversi JSON ke DataFrame 1 baris
        df = pd.DataFrame([input_data])[features]
        
        # Hitung probabilitas untuk kelas 1 (Meninggal)
        probabilitas = float(rf.predict_proba(df)[0][1])
        
        # Kirim balik ke Node.js via print
        print(json.dumps({"success": True, "probability": probabilitas}))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()