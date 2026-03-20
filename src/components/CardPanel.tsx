import Card from "./Card";
import { VenueItem } from "@/interface";

interface VenueJson {
  success: boolean;
  count: number;
  data: VenueItem[];
}

interface CardPanelProps {
  venuesJson: VenueJson;
}

export default function CardPanel({ venuesJson }: CardPanelProps) {
  const venues = venuesJson.data;

  if (!venues || venues.length === 0) {
    return (
      <div className="text-center py-20">
        <p
          className="text-xl tracking-widest"
          style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}
        >
          No hotels available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
      {venues.map((venue: VenueItem) => (
        <Card
          key={venue.id || venue._id}
          vid={venue.id || venue._id}
          name={venue.name}
          address={venue.address}
          province={venue.province}
          dailyrate={venue.dailyrate}
          picture={venue.picture}
        />
      ))}
    </div>
  );
}
