// src/app/(venueinfo)/venue/[vid]/page.tsx
import Image from "next/image";
import getVenue from "@/libs/getVenue";

export default async function VenuePage({ params }: any) {
  const vid = params.vid;

  const venueJson = await getVenue(vid);
  const venue = venueJson.data[0]; // assume API คืน array ของ 1 item

  if (!venue) {
    return <p>ไม่พบสถานที่จองนะพี่ม่อน QwQ</p>;
  }

  return (
    <main className="p-6">
      <Image
        src={venue.picture ?? "/default.png"}
        alt={venue.name}
        width={300}
        height={200}
        className="rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{venue.name}</h1>
      <p className="mt-2"><b>Location:</b> {venue.location}</p>
      <p className="mt-1"><b>Capacity:</b> {venue.capacity}</p>
    </main>
  );
}