// File: app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Public_Sans, Source_Code_Pro } from "next/font/google";
import "../globals.css";
import "flag-icons/css/flag-icons.min.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "CirrhoSmart AI | Clinical Decision Support System",
  description: "Explainable AI and clinical decision support system for liver cirrhosis prognosis and personalized pharmacotherapy dosing",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className={`${publicSans.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
