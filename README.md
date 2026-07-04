
# Clinical Decision Support System (CDSS) for Liver Cirrhosis

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

## Project Overview
This repository contains the end-to-end implementation of a **Hybrid AI Clinical Decision Support System (CDSS)** designed to assist medical professionals in managing patients with liver cirrhosis. 

Commissioned as the core technical foundation for a Clinical Pharmacy Doctoral (PhD) dissertation (Target Publication: *Q1 Scopus-Indexed Journal in Medical Informatics*), this project bridges the gap between **Data-Driven Machine Learning** and **Logic-Driven Expert Systems**.

## Key Features
1. **AI Prognosis Predictor (Machine Learning):**
   * Predicts patient mortality (AUROC: 0.854) based on admission clinical baselines.
   * Predicts prolonged Length of Stay (LoS) > 7 days, successfully identifying clinical survival biases using Random Forest and XGBoost.
2. **Clinical Dosage Expert System (Rule-Based):**
   * A deterministic rule engine providing real-time hepatotoxic drug dosage recommendations.
   * Covers 8 critical drug combinations across 3 categories: Diuretics, Beta-blockers, and Antibiotics.
   * Dynamically adjusts recommendations based on GFR (CrCl), Child-Turcotte-Pugh (CTP) class, and acute complications (AKI, HRS, Sepsis).
3. **Real-Time Clinical Calculators:**
   * Automated CKD-EPI 2021 GFR calculation.
   * Automated CTP Class scoring system.

## Architecture & Tech Stack
* **Frontend:** Next.js (App Router), TypeScript, TailwindCSS
* **Backend:** Vercel Serverless Functions (Python 3.12 for ML Inference, Node.js for DB operations)
* **Database:** Supabase (PostgreSQL), Prisma ORM (implemented with Singleton/Lazy Loading to prevent serverless connection pooling crashes)
* **AI / Data Science:** Scikit-Learn, XGBoost, Pandas, NumPy, Joblib

## Monorepo Structure
```text
sirosis-app/
│
├── research/                   # Machine Learning & Data Science Workspace
│   ├── notebooks/              # Jupyter Notebooks for data cleaning, EDA, and modeling
│   ├── scripts/                # Python scripts for MICE imputation & preprocessing
│   └── data/                   # (Dummy/Sample Data Only - No PHI)
│
├── assets/                     # Architecture diagrams and UI screenshots
│
└── web/                        # Next.js Production Application
    ├── api/                    # Vercel Serverless Python APIs (predict.py, dosis.py)
    ├── app/                    # Next.js Frontend
    ├── deployment/             # Serialized ML Models (.joblib)
    ├── prisma/                 # Database Schema
    └── requirements.txt        # Python dependencies

```

## Machine Learning Engineering Highlights

This project involved rigorous data science methodologies to handle real-world, noisy clinical data:

* **End-to-End Preprocessing:** Handled extreme biological outliers and executed robust imputation using **MICE** (*Multiple Imputation by Chained Equations*) via Random Forest for numerical data, and majority-vote for categorical features.
* **In-Depth EDA:** Utilized Point-Biserial correlation, Cramér’s V, and Mutual Information (MI) to uncover predictive signals, successfully documenting the limitation of clinical variables in predicting LoS (identifying systemic operational factors).
* **Class Imbalance Mitigation:** Addressed severe 1:3.2 mortality class imbalance using Stratified 5-Fold Cross-Validation, `class_weight='balanced'`, and `scale_pos_weight`.
* **Dynamic Feature Engineering:** Integrated live MELD score calculation directly into the Python inference pipeline before feeding data into the predictive model.


## Data Privacy Disclaimer

**Strict No-PHI Policy:** This repository does NOT contain any Protected Health Information (PHI). All original medical records, datasets, and excel files used during the research phase have been strictly added to `.gitignore`. Only structure dictionaries and synthesized dummy datasets are provided for structural demonstration.

## Authors

* **Machine Learning Engineer & Full-Stack Developer:** Yavie Azka Putra Araly - Institut Teknologi Bandung (yavieazkaputra@gmail.com | yavieazka.space)
* **Principal Clinical Researcher:** Serdiani - Universitas Andalas
