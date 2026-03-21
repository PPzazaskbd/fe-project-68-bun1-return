export interface BookingItem {
  id?: string;
  nameLastname: string;
  tel: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  userEmail?: string;
}




export interface HotelItem {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;       // NEW
  tel: string;
  description: string;  // NEW
  imgSrc: string;       // CHANGED from picture
  price: number;        // CHANGED from dailyrate
  __v: number;
}

export interface HotelJson {
  success: boolean;
  count: number;
  pagination: object;
  data: HotelItem[];
}

export interface SingleHotelJson {
  success: boolean;
  data: HotelItem;
}
