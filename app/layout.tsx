import type { Metadata } from "next";
import { Inter, Bagel_Fat_One } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gaga",
});

export const metadata: Metadata = {
  title: "gaga - Admin Panel",
  description: "gaga X LinkCaring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${bagelFatOne.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
