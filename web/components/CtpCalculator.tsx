// File: components/CtpCalculator.tsx
import React from 'react';
import { CtpParamKey, CtpParams, CTP_OPTIONS, CTP_PARAM_LABELS } from '../utils/clinical';

export default function CtpCalculator({
  active, onToggle, params, onChangeParam, hasil, children
}: {
  active: boolean;
  onToggle: (val: boolean) => void;
  params: CtpParams;
  onChangeParam: (key: CtpParamKey, value: string) => void;
  hasil: { total: number; kelas: 'A' | 'B' | 'C' } | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mt-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <label className="text-sm font-bold text-gray-700">Skor CTP (Child-Turcotte-Pugh)</label>
        <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
          <input type="checkbox" className="w-4 h-4 text-red-800 rounded focus:ring-red-800"
            checked={active} onChange={(e) => onToggle(e.target.checked)} />
          <span className="text-xs font-bold text-red-900">Hitung Otomatis dari Parameter Klinis</span>
        </label>
      </div>

      {active && (
        <div className="space-y-3 mb-4 p-4 bg-white rounded-xl border border-red-100 shadow-inner">
          {(Object.keys(CTP_OPTIONS) as CtpParamKey[]).map((key) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-600 mb-1">{CTP_PARAM_LABELS[key]}</label>
              <select required={active} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-800 focus:border-red-800 bg-white"
                value={params[key]} onChange={(e) => onChangeParam(key, e.target.value)}>
                <option value="">-- Pilih --</option>
                {CTP_OPTIONS[key].map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}

          {hasil && (
            <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-center">
              <p className="text-xs font-semibold text-gray-600">Total Skor: <span className="font-black text-red-900">{hasil.total}</span> &nbsp;→&nbsp; Kelas CTP: <span className="font-black text-red-900">{hasil.kelas}</span></p>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}