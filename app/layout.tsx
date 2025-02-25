import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon Explorer",
  description: "Explore and search Pokemons",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar */}
        <nav className="bg-white text-green-700 p-4 shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center">
            <h1 className="text-2xl font-bold">Pokemon Explorer</h1>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
