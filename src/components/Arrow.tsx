"use client"
export default function Arrow({
  direction,
  disabled,
}: {
  direction: "left" | "right";
  disabled?: boolean;
}) {
  const rotation = direction === "right" ? "rotate(180deg)" : "none";

  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform:rotation}}>
<path d="M0 27.7129L48 7.62939e-05V55.4257L0 27.7129Z" fill="#B71422" fill-opacity="0.5"/>
</svg>

  );
}