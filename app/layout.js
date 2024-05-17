import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Provider from "@/components/Provider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LHL final project",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}