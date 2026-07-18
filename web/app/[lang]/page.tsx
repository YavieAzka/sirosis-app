// File: app/[lang]/page.tsx
import { getDictionary } from '@/dictionaries/getDictionary';
import ClientHome from './components/ClientHome';

export default async function Page({ 
  params 
}: { 
  // Ubah tipe data params menjadi Promise
  params: Promise<{ lang: 'id' | 'en' }> 
}) {
  // Buka (unwrap) params menggunakan await
  const { lang } = await params;

  // Panggil kamus bahasa di sisi server
  const dict = await getDictionary(lang);

  // Lempar kamus ke komponen UI utama
  return <ClientHome lang={lang} dict={dict} />;
}