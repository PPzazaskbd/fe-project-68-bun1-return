import {HotelJson} from "../interface";

export default async function getVenues() {
  const response = await fetch("https://backend-for-frontend-bun1.vercel.app/api/v1/hotels",
    {next: {revalidate: 60}}
  );


if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  
  const data = await response.json();

  return data as HotelJson;
}
