"use client";

import { useEffect, useState } from "react";
import { VenueJson } from "../interface";
import Card from "./Card";

export default function VenueCatalog() {
  const [venues, setVenues] = useState<VenueJson | null>(null);

  useEffect(() => {
    fetch("/api/venues")
      .then(res => res.json())
      .then(data => setVenues(data))
      .catch(err => console.error(err));
  }, []);

  if (!venues) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-8 mt-6 justify-items-center">
      {venues.data.map((item) => (
        <Card
          key={item.id.toString()}
          vid={item.id.toString()}
          name={item.name}
          picture={item.picture ?? ""}
        />
      ))}
    </div>
  );
}