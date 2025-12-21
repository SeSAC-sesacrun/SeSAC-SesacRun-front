import type { Metadata } from "next";
import "./globals.css";
import ClientHeader from "@/components/layout/ClientHeader";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CourseHub - 온라인 강의 플랫폼",
  description: "최고의 전문가들이 만든 다양한 강의를 통해 새로운 기술을 배우고 커리어를 발전시켜 보세요.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background-light dark:bg-background-dark">
        <div className="flex flex-col min-h-screen">
          <ClientHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}


