"use client";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DateReserve from "@/components/DateReserve";
import { TextField, Button } from "@mui/material";
import updateReservation from "@/libs/updateReservations";
import { Dayjs } from "dayjs";

export default function EditReservation() {
  const router = useRouter();
  const params = useParams();
  const rid = params.rid;
  const { data: session } = useSession();

  if (!session || !session.user.token) {
    return (
      <main className="w-[100%] flex flex-col items-center space-y-4">
        <div className="font-semibold text-gray-600 text-xl text-center">
          Please Sign in
        </div>
      </main>
    );
  }

  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [message, setMessage] = useState("");
  const spaceData = JSON.parse(sessionStorage.getItem("coWorkingSpace") || "{}");
  const nameData = JSON.parse(sessionStorage.getItem("userName") || "{}");

  const handleEdit = async () => {
    if (!session || !reserveDate) {
      setMessage("All fields must be filled before submission.");
      return;
    }

    try {
      const response = await updateReservation(
        rid as string,
        reserveDate.toDate(),
        session.user.token
      );

      if (!response.success) {
        setMessage(response.message)
        return;
      }

      alert("Reservation edited, Close this page");
    } catch (error) {
      setMessage("Unexpected Error Occurred");
    }
  };

  return (
    <div className="w-[30%] bg-white p-6 rounded-lg shadow-6xl flex flex-col items-center
     space-y-4 border border-gray-300 mx-auto my-20">
      <div className="text-2xl font-bold">Edit Your Reservation</div>
      <div className="w-fit">
        <div className="text-md text-left font-semibold text-gray-600 mt-5">
          Reservation Information
        </div>
        <TextField
          variant="standard"
          name="User"
          label="User"
          value={nameData.name}
          disabled
        />

        <div className="text-md text-left font-semibold text-gray-600 mt-5">
          Co-Working Space Selected
        </div>
        <div className="font-semibold">{spaceData.name}</div>

        <div className="text-md text-left font-semibold text-gray-600 mt-5">
          Reservation Date
        </div>
        <DateReserve
          onDateChange={(value: Dayjs) => {
            setReserveDate(value);
          }}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleEdit}
      >
        Confirm Editing
      </Button>
      <p className="text-red-500 mt-3">{message}</p>
    </div>
  );
}
