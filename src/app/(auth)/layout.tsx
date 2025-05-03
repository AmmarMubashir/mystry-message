import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mystry Message",
  description: "Send your anonymous message",
  openGraph: {
    title: "Mystry Message",
    description: "Send your anonymous message",
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.png", // This sets the favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
