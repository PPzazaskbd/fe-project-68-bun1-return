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

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  tel: string;
  password: string;
  role?: string;
  __v?: number;
}

export interface HotelItem {
  _id: string;
  id?: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  region: string;
  tel: string;
  description: string;
  imgSrc?: string;
  price: number;
  __v?: number;
}

export interface HotelJson {
  success: boolean;
  count: number;
  pagination?: Record<string, unknown>;
  data: HotelItem[];
}

export interface SingleHotelJson {
  success: boolean;
  data: HotelItem;
}
