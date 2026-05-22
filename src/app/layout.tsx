import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grain Conference Intelligence",
  description: "A sales command center for prioritizing conferences, capturing leads, and spotting repeat relationships."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
