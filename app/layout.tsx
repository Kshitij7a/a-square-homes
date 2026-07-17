import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Square Homes — Ultra-Luxury Interior Design",
  description: "Experience the uncompromising luxury of A Square Homes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
