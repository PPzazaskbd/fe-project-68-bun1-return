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
      const newBooking = action.payload;
      const index = state.bookItems.findIndex(
        (item) =>
          item.venue === newBooking.venue &&
          item.bookDate === newBooking.bookDate
      );
      if (index !== -1) {
        state.bookItems[index] = newBooking;
      } else {
        state.bookItems.push(newBooking);
      }
    },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      const target = action.payload;
      state.bookItems = state.bookItems.filter(
        (item) =>
          !(
            item.nameLastname === target.nameLastname &&
            item.tel === target.tel &&
            item.venue === target.venue &&
            item.bookDate === target.bookDate
          )
      );
    },
  },
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;