import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')

database_url = os.getenv("DIRECT_URL") # Pastikan menggunakan DIRECT_URL

if not database_url:
    raise ValueError("DIRECT_URL tidak ditemukan di file .env.local.")

if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

try:
    nama_file_csv = 'data_final_clean_manual.csv' 
    print(f"📖 Membaca file {nama_file_csv}...")
    df_raw = pd.read_csv(nama_file_csv)

    # =================================================================
    # PROSES PEMBERSIHAN KOMA DESIMAL (TAMBAHKAN KODE INI)
    # =================================================================
    print("🧹 Menyelaraskan format desimal (mengubah koma ',' menjadi titik '.')...")
    
    # Daftar kolom bertipe angka di database yang di CSV-nya terdeteksi memakai koma
    kolom_angka = [
        'imt', 'usia', 'gfr', 'alkohol',
        'komp_ascites', 'komp_jaundice', 'komp_eh', 'komp_varises', 'komp_melena', 'komp_sbp',
        'komor_dm', 'komor_ht', 'komor_pgk', 'komor_pneumonia', 'komor_sepsis',
        'sgpt_max', 'sgpt_n', 'sgpt_baseline',
        'sgot_n', 'sgot_baseline',
        'albumin_baseline',
        'bilirubin_n', 'bilirubin_baseline',
        'inr_baseline',
        'kreatinin_baseline',
        'urea_n', 'urea_baseline',
        'kalium_baseline',
        'natrium_min', 'natrium_n', 'natrium_baseline', 'natrium_last',
        'klorida_n', 'klorida_baseline',
        'diuretik_ada', 'diuretik_spiro_dosis',
        'betabloker_ada', 'betabloker_propranolol_dosis',
        'analgetik_ada', 'analgetik_paracetamol_dosis',
        'antibiotik_ada', 'antibiotik_ceftriaxone_ada', 'antibiotik_ceftriaxone_dosis',
        'antibiotik_cefotaxime_ada', 'antibiotik_cefotaxime_dosis',
        'antibiotik_cefepime_ada', 'antibiotik_cefepime_dosis',
        'antibiotik_ampisul_ada', 'antibiotik_ampisul_dosis',
        'antibiotik_levofloxacin_ada', 'antibiotik_levofloxacin_dosis',
        'antibiotik_azithromycin_ada', 'antibiotik_azithromycin_dosis',
        'statin_ada'
    ]

    for col in kolom_angka:
        if col in df_raw.columns:
            # Jika kolom berupa string/object dan mengandung koma, ganti ke titik
            if df_raw[col].dtype == 'object':
                df_raw[col] = df_raw[col].str.replace(',', '.', regex=False)
            
            # Ubah tipe datanya menjadi numerik agar siap masuk ke database Float
            df_raw[col] = pd.to_numeric(df_raw[col], errors='coerce')
    # =================================================================

    print("🔌 Menyambungkan koneksi ke server Supabase...")
    engine = create_engine(database_url)

    print("🚀 Sedang mengunggah data ke Supabase...")
    df_raw.to_sql(
        name='patient', 
        con=engine, 
        if_exists='append',  
        index=False          
    )

    print("✅ Berhasil! Semua data dari CSV telah sukses diunggah ke database online Anda.")

except Exception as e:
    print(f"❌ Terjadi Error saat proses upload: {e}")