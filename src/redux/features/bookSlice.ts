import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "@/interface";

type BookState = {
  bookItems: BookingItem[];
};

const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
      const newBooking = { ...action.payload, id: action.payload.id || Date.now().toString() };
      const index = state.bookItems.findIndex(
        (item) =>
          item.hotel === newBooking.hotel &&
          item.checkIn === newBooking.checkIn
      );
      if (index !== -1) {
        state.bookItems[index] = newBooking;
      } else {
        state.bookItems.push(newBooking);
      }
    },
    updateBooking: (state, action: PayloadAction<{ id: string; item: BookingItem }>) => {
      const index = state.bookItems.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookItems[index] = { ...action.payload.item, id: action.payload.id };
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      const target = action.payload;
      state.bookItems = state.bookItems.filter(
        (item) =>
          !(
            item.nameLastname === target.nameLastname &&
            item.tel === target.tel &&
            item.hotel === target.hotel &&
            item.checkIn === target.checkIn
          )
      );
    },
  },
});

export const { addBooking, updateBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
