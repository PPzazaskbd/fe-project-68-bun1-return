import { VenueJson } from "../interface";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function getVenue(vid: string): Promise<VenueJson> {
  const res = await fetch(`${baseUrl}/api/venues/${vid}`);
  if (!res.ok) throw new Error("Failed to fetch venue");
  return res.json();
}