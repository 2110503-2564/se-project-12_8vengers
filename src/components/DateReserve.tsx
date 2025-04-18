"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function DateReserve({
  onDateChange,
}: {
  onDateChange: Function;
}) {
  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDateChange = (value: Dayjs | null) => {
    if (value && value.isBefore(dayjs(), 'day')) {
      setErrorMessage("You cannot select a past date.");
      setReserveDate(null);
      onDateChange(null); 
    } else {
      setErrorMessage("");
      setReserveDate(value);
      onDateChange(value);
    }
  };

  return (
    <div
      className="bg-slate-100 rounded-lg space-x-5 space-y-2 
        w-fit px-10 py-5 flex flex-row justify-center"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          className="bg-white"
          value={reserveDate}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
      {errorMessage && (
        <p className="text-red-500 text-md mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
