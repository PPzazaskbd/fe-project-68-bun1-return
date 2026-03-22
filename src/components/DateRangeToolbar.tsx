"use client";

interface DateRangeToolbarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

export default function DateRangeToolbar({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangeToolbarProps) {
  return (
    <div className="figma-toolbar">
      <span className="figma-toolbar-label">from</span>
      <input
        type="date"
        value={fromDate}
        onChange={(event) => onFromDateChange(event.target.value)}
        className="figma-toolbar-input"
        aria-label="From date"
      />

      <span className="figma-toolbar-label">to</span>
      <input
        type="date"
        value={toDate}
        onChange={(event) => onToDateChange(event.target.value)}
        className="figma-toolbar-input"
        aria-label="To date"
      />
    </div>
  );
}
