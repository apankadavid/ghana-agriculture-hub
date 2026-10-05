import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/site-chrome";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileTabBar from "@/components/mobile-tab-bar";
export const metadata: Metadata = {
  title: "Ghana Agriculture Hub: Everything Agriculture. One Place.",
  description:
    "Connect with farmers, buyers, suppliers and service providers across Ghana's agricultural ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome header={<Header />} footer={<Footer />} mobileTabBar={<MobileTabBar />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}