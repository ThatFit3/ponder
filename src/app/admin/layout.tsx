import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AdminNavbar from "../components/adminNavbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ponder",
  description: "Aquaculture system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AdminNavbar />
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
