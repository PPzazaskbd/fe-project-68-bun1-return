import { VenueJson } from "../interface";

export default async function getVenues(): Promise<VenueJson> {
  const venuesModule = await import("../data/venues.json");
  return venuesModule.default as VenueJson;
}