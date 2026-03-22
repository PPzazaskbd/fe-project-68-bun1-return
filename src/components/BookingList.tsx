"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { BookingItem } from "@/interface";
import getHotels from "@/libs/getHotels";

const hotelNames = getHotels().data.map((h) => h.name);
// why?

const STORAGE_KEY = "bun1_bookings";
function loadBookings(): BookingItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveBookings(items: BookingItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function calcNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

const labelClass = "text-xs tracking-[0.2em] uppercase";
const inputClass =
  "border-b border-[#C8881E] bg-transparent py-1 text-[#130900] focus:outline-none focus:border-[#130900] transition-colors text-sm w-full";

interface EditState {
  nameLastname: string;
  tel: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function BookingList({ isAdmin = false }: { isAdmin?: boolean }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const effectiveAdmin = isAdmin || session?.user?.role === "admin" || userEmail === "admin@example.com";

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editError, setEditError] = useState("");
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const all = loadBookings();
    setBookings(effectiveAdmin ? all : all.filter((b) => b.userEmail === userEmail));
  }, [effectiveAdmin, userEmail]);

  const handleRemove = (item: BookingItem) => {
    const all = loadBookings().filter((b) => b.id !== item.id);
    saveBookings(all);
    setBookings((prev) => prev.filter((b) => b.id !== item.id));
  };

  const startEdit = (item: BookingItem) => {
    setEditingId(item.id || null);
    setEditState({ nameLastname: item.nameLastname, tel: item.tel, hotel: item.hotel, checkIn: item.checkIn, checkOut: item.checkOut, guests: item.guests });
    setEditError("");
  };

  const saveEdit = (item: BookingItem) => {
    if (!editState || !item.id) return;
    const checkIn = checkInRef.current?.value || editState.checkIn;
    const checkOut = checkOutRef.current?.value || editState.checkOut;

    if (!editState.nameLastname.trim()) { setEditError("Guest name is required."); return; }
    if (!editState.tel.trim()) { setEditError("Contact number is required."); return; }
    if (!checkIn) { setEditError("Check-in date is required."); return; }
    if (!checkOut) { setEditError("Check-out date is required."); return; }
    if (checkOut <= checkIn) { setEditError("Check-out must be after check-in."); return; }
    const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    if (nights > 3) { setEditError("Maximum stay is 3 nights."); return; }

    const updated: BookingItem = { ...item, ...editState, checkIn, checkOut };
    const all = loadBookings().map((b) => b.id === item.id ? updated : b);
    saveBookings(all);
    setBookings((prev) => prev.map((b) => b.id === item.id ? updated : b));
    setEditingId(null);
    setEditState(null);
    setEditError("");
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px w-16 bg-[#C8881E] opacity-30" />
          <div className="w-10 h-10 border border-[#C8881E] opacity-30 flex items-center justify-center">
            <span style={{ color: "#C8881E", fontSize: "1.2rem" }}>◇</span>
          </div>
          <div className="h-px w-16 bg-[#C8881E] opacity-30" />
        </div>
        <p className="text-xl sm:text-2xl tracking-wide mb-2" style={{ color: "#2A1005", fontFamily: "'Cormorant SC', serif", fontWeight: 400 }}>
          No Stays Booked Yet
        </p>
        <p className="text-sm tracking-widest uppercase" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
          Your upcoming hotel stays will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {bookings.map((item: BookingItem, index: number) => {
        const nights = calcNights(item.checkIn, item.checkOut);
        const isEditing = editingId === item.id;

        return (
          <div key={item.id || index} className="bg-white p-4 sm:p-8 flex flex-col gap-4" style={{ border: "1px solid #D4AD7A" }}>
            <div className="flex items-center justify-between">
              <div className="text-2xl sm:text-3xl font-light" style={{ color: "#C8D8E8", fontFamily: "'Cormorant SC', serif" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              {effectiveAdmin && item.userEmail && (
                <span className="text-xs" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>
                  {item.userEmail}
                </span>
              )}
              <div className="flex gap-2">
                {!isEditing && (
                  <button onClick={() => startEdit(item)} className="px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#130900] hover:text-white" style={{ border: "1px solid #9C6240", color: "#9C6240", background: "transparent", fontFamily: "'Cormorant SC', serif" }}>
                    Edit
                  </button>
                )}
                {isEditing && (
                  <button onClick={() => { setEditingId(null); setEditState(null); setEditError(""); }} className="px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#9C6240] hover:text-white" style={{ border: "1px solid #9C6240", color: "#9C6240", background: "transparent", fontFamily: "'Cormorant SC', serif" }}>
                    Discard
                  </button>
                )}
                <button onClick={() => handleRemove(item)} className="px-4 py-2 text-xs tracking-[0.25em] uppercase transition-all hover:bg-[#0D1B2A] hover:text-white" style={{ border: "1px solid #C4973A", color: "#C8881E", background: "transparent", fontFamily: "'Cormorant SC', serif" }}>
                  Cancel
                </button>
              </div>
            </div>

            {isEditing && editState ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Guest Name</label>
                    <input type="text" value={editState.nameLastname} onChange={(e) => setEditState({ ...editState, nameLastname: e.target.value })} className={inputClass} style={{ fontFamily: "'Cormorant SC', serif" }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Contact Number</label>
                    <input type="tel" value={editState.tel} onChange={(e) => setEditState({ ...editState, tel: e.target.value.replace(/\D/g, "") })} className={inputClass} style={{ fontFamily: "'Cormorant SC', serif" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Hotel</label>
                  <select value={editState.hotel} onChange={(e) => setEditState({ ...editState, hotel: e.target.value })} className={inputClass} style={{ fontFamily: "'Cormorant SC', serif", cursor: "pointer" }}>
                    {hotelNames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Check-In</label>
                    <input type="date" ref={checkInRef} defaultValue={editState.checkIn} onChange={(e) => setEditState({ ...editState, checkIn: e.target.value })} onBlur={(e) => setEditState({ ...editState, checkIn: e.target.value })} className={inputClass} style={{ fontFamily: "'Cormorant SC', serif" }} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Check-Out</label>
                    <input type="date" ref={checkOutRef} defaultValue={editState.checkOut} onChange={(e) => setEditState({ ...editState, checkOut: e.target.value })} onBlur={(e) => setEditState({ ...editState, checkOut: e.target.value })} className={inputClass} style={{ fontFamily: "'Cormorant SC', serif" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass} style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Guests</label>
                  <div className="flex items-center gap-4 border-b border-[#C8881E] py-1">
                    <button type="button" onClick={() => setEditState({ ...editState, guests: Math.max(1, editState.guests - 1) })} className="w-7 h-7 flex items-center justify-center" style={{ color: "#9C6240", border: "1px solid #D4AD7A", fontFamily: "'Cormorant SC', serif" }}>−</button>
                    <span className="flex-1 text-center text-sm" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{editState.guests} {editState.guests === 1 ? "Guest" : "Guests"}</span>
                    <button type="button" onClick={() => setEditState({ ...editState, guests: Math.min(10, editState.guests + 1) })} className="w-7 h-7 flex items-center justify-center" style={{ color: "#9C6240", border: "1px solid #D4AD7A", fontFamily: "'Cormorant SC', serif" }}>+</button>
                  </div>
                </div>
                {editError && <p className="text-sm" style={{ color: "#8B3A3A", fontFamily: "'Cormorant SC', serif" }}>{editError}</p>}
                <button onClick={() => saveEdit(item)} className="py-3 text-white tracking-[0.3em] uppercase text-xs transition-opacity hover:opacity-80" style={{ background: "#130900", fontFamily: "'Cormorant SC', serif" }}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Guest</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}>{item.nameLastname}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Contact</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{item.tel}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Hotel</p>
                  <p className="text-base sm:text-lg" style={{ color: "#C8881E", fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}>{item.hotel}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Check-In</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{item.checkIn}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Check-Out</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{item.checkOut}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Duration</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{nights} {nights === 1 ? "Night" : "Nights"}</p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: "#9C6240", fontFamily: "'Cormorant SC', serif" }}>Guests</p>
                  <p className="text-base sm:text-lg" style={{ color: "#130900", fontFamily: "'Cormorant SC', serif" }}>{item.guests} {item.guests === 1 ? "Guest" : "Guests"}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
