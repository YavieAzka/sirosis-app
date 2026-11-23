// File: app/[lang]/download/page.tsx
import { getDictionary } from "@/dictionaries/getDictionary";
import ClientHome from "../components/ClientHome";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ lang: "id" | "en" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ClientHome lang={lang} dict={dict} initialView="download" />;
}
