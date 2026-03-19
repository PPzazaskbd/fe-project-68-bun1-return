export interface BookingItem {
  nameLastname: string;
  tel: string;
  venue: string;
  bookDate: string;
}

export interface VenueItem {
  _id: string;
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
  dailyrate: number;
  __v: number;
}

export interface VenueJson {
  success: boolean;
  count: number;
  pagination: object;
  data: VenueItem[];
}

export interface SingleVenueJson {
  success: boolean;
  data: VenueItem;
}
