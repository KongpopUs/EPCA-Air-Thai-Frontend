import "./globals.css";
import GovNavbar from "../components/GovNavbar";

export const metadata = {
  title: "EPCA Air Thai",
  description: "ระบบตรวจสอบคุณภาพอากาศ PM2.5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-slate-50 text-slate-900">
        <GovNavbar />
        <main>{children}</main>
      </body>
    </html>
  );
}