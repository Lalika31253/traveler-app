import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Provider from "@/components/Provider";

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
          <main className="h-screen flex flex-col justify-center items-center">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}