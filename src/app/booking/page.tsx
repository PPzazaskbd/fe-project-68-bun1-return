import BookingList from "@/components/BookingList";
import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">มาจองเร็วๆจร้าาา ถ้ากรอกไม่ครบเจอกันหลังเซเว่นปิดนะเพ่ !</h1>

      {/* ฟอร์มจอง */}
      <BookingForm />

      {/* แสดง booking ที่เก็บใน redux */}
      <BookingList />
    </div>
  );
}