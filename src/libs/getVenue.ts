import hotels from "../data/hotels";

export default async function getVenue(vid: string) {
  const hotel = hotels.data.find((h) => h.id === vid || h._id === vid);
  return { success: !!hotel, data: hotel ?? null };
}
// TODO: update this to fetch from backend instead of local data, and handle errors properly.