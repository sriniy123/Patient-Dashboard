import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdBanner from "@/components/AdBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chronic Patient Dashboard",
  description: "Track your health and get AI-powered insights.",
};

import { PatientProvider } from "@/context/PatientContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PatientProvider>
          <div className="app-layout">
            <AdBanner position="top" />
            <div className="app-main-wrapper">
              <main className="app-content">
                {children}
              </main>
              <AdBanner position="right" />
            </div>
          </div>
        </PatientProvider>
      </body>
    </html>
  );
}
