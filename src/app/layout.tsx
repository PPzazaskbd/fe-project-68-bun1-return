"use client";

import "./globals.css";
import TopMenu from "@/components/TopMenu";
import ReduxProvider from "@/redux/ReduxProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <TopMenu />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}