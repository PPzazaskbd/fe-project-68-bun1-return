"use client";

import { useEffect, useState } from "react";
import { HotelJson } from "@/interface";
import Card from "./Card";

export default function VenueCatalogClient() {
  const [venues, setVenues] = useState<HotelJson | null>(null);

  useEffect(() => {
    fetch("/api/venues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);

  if (!venues) {
    return (
      <p className="font-figma-copy text-[1.4rem] text-[var(--figma-ink-soft)]">
        Loading...
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {venues.data.map((item) => (
        <Card
          key={item.id || item._id}
          vid={item.id || item._id}
          name={item.name}
          address={item.address}
          province={item.province}
          price={item.price}
          imgSrc={item.imgSrc}
        />
      ))}
    </div>
  );
}
