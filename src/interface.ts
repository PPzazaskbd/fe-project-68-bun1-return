export interface BookingItem {
  nameLastname: string;
  tel: string;
  venue: string;
  bookDate: string;
}

export interface VenueItem {
  id: number;
  name: string;
  location: string;
  capacity: number;
  picture?: string; 
}

export interface VenueJson {
  data: VenueItem[];
}