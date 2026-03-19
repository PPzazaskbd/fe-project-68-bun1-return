"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "../interface";

export default function BookingList() {
  const dispatch = useDispatch();

  // 🔥 รองรับทั้ง key 'book' และ 'bookSlice'
  const bookings = useSelector((state: any) => 
    state.book?.bookItems ?? state.bookSlice?.bookItems ?? []
  );

  if (bookings.length === 0) {
    return <p>การจองว่างบ๋อแบ๋ ไปจองก่อนสิฟะะ!</p>;
  }

  return (
    <div>
      {bookings.map((item: BookingItem, index: number) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
            transition: "all 0.3s",
          }}
        >
          <p><b>Name:</b> {item.nameLastname}</p>
          <p><b>Tel:</b> {item.tel}</p>
          <p><b>Venue:</b> {item.venue}</p>
          <p><b>Date:</b> {item.bookDate}</p>

          <button
            onClick={() => dispatch(removeBooking(item))}
            className="mt-2 p-1 border rounded bg-yellow-400 text-pink-500 hover:bg-red-200"
          >
            จะยกเลิกการจองหรอ? กดที่นิจิ
          </button>
        </div>
      ))}
    </div>
  );
}