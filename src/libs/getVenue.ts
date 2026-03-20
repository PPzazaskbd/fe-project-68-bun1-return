import hotels from "../data/hotels";

export default async function getVenue(vid: string) {
  const hotel = hotels.data.find((h) => h.id === vid || h._id === vid);
  return { success: !!hotel, data: hotel ?? null };
}
