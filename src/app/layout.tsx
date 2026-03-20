import type { Metadata } from "next";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import PageTransition from "@/components/PageTransition";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const metadata: Metadata = {
  title: "Bun1 — Luxury Hotel Booking",
  description: "Premium hotel venue booking experience",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions).catch(() => null);

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <NextAuthProvider session={session}>
            <TopMenu />
            <PageTransition>{children}</PageTransition>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
