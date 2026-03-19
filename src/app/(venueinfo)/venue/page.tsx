"use client";

import Banner from "@/components/Banner";
import VenueCatalogClient from "@/components/VenueCatalogClient";

export default function VenuePage() {
  return (
    <main>
      <Banner />

      {/* ใช้ Client Component ที่ fetch data เอง */}
      <VenueCatalogClient />
    </main>
  );
}