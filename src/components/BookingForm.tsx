// components/BookingForm.tsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "../interface";

export default function BookingForm() {
  const dispatch = useDispatch();

  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [venue, setVenue] = useState("");
  const [bookDate, setBookDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameLastname || !tel || !venue || !bookDate) {
      alert("กรอกข้อมูลให้ครบสิเฟ้ย! เดี้ยวได้เจอกันหลังเซเว่นปิดแน่");
      return;
    }

    const newBooking: BookingItem = { nameLastname, tel, venue, bookDate };
    dispatch(addBooking(newBooking));

    // รีเซ็ต form
    setNameLastname("");
    setTel("");
    setVenue("");
    setBookDate("");
    alert("เย๊ะะะ จองสำเร็จแล้ว!");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-md">
      <input
        type="text"
        placeholder="ชื่อ-นามสกุล"
        value={nameLastname}
        onChange={(e) => setNameLastname(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="เบอร์โทร"
        value={tel}
        onChange={(e) => setTel(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="สถานที่"
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={bookDate}
        onChange={(e) => setBookDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-green-500">
        ปุ่มจอง.exe
      </button>
    </form>
  );
}