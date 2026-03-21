// what are TODO: here? : decide if checkOut is needed, decide if __v is needed in UserProfile, decide if createdAt is needed in UserProfile
export interface BookingItem {
  _id?: string;          // MongoDB ObjectId
  user: string;          // User ObjectId
  hotel: string;         // Hotel ObjectId
  startDate: string;     // ISO Date string
  nights: number;
  checkOut: string; // is this needed? can be calculated from startDate and nights TODO: decide if checkOut is needed
  guestsAdult: number; 
  guestsChild: number; 
  totalPrice: number; 
  roomNumber: string;  
  __v?: number; // optional, as it is added by MongoDB
}


export interface UserProfile {
  _id: string; 
  name: string; 
  email: string;
  tel: string;
  password: string; 
  __v?: number; // optional, as it is added by MongoDB is this needed? : no
  // is created at neeeded? : no  
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
  __v?: number; // optional, as it is added by MongoDB
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
