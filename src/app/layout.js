import localFont from "next/font/local";
import { AuthProvider } from "./contexts/AuthContext";
import AuthWrapper from "./components/AuthWrapper";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Dev Logger",
  description: "Daily Task Logger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}>
        <AuthProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
