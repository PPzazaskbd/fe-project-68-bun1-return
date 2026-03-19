'use client'

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

export default function DateReserve() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Reservation Date"/>
    </LocalizationProvider>
  )
}