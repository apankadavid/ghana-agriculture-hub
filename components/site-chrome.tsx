"use client";

import { usePathname } from "next/navigation";

export default function SiteChrome({
  header,
  footer,
  mobileTabBar,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  mobileTabBar: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <>
        <div className="pb-16 md:pb-0">{children}</div>
        {mobileTabBar}
      </>
    );
  }

  return (
    <>
      {header}
      <div className="pb-16 md:pb-0">{children}</div>
      {footer}
      {mobileTabBar}
    </>
  );
}