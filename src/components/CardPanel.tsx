import Card from "./Card";
import { HotelItem, HotelJson } from "@/interface";

interface HotelJson {
  success: boolean;
  count: number;
  data: HotelItem[];
}

interface CardPanelProps {
  hotelsJson: HotelJson;
}

export default function CardPanel({ hotelsJson }: CardPanelProps) {
  const hotels = hotelsJson.data;

  if (!hotels || hotels.length === 0) {
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
      {hotels.map((hotel: HotelItem) => (
        <Card
          key={hotel.id || hotel._id}
          vid={hotel.id || hotel._id}
          name={hotel.name}
          address={hotel.address}
          province={hotel.province}
          price={hotel.price}
          imgSrc={hotel.imgSrc}
        />
      ))}
    </div>
  );
}
