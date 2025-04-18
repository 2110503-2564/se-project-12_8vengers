"use client";
import DateReserve from "@/components/DateReserve";
import { Select, MenuItem, TextField, Button } from "@mui/material";
import createReservation from "@/libs/createReservation";
import getUserProfile from "@/libs/getUserProfile";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { CoWorkingSpaceItem, User } from "../../../interface";
import { useSession } from "next-auth/react";
import getCoWorkingSpaces from "@/libs/getCoWorkingSpaces";

export default function Reservation() {
  const { data: session } = useSession();

  if (!session || !session.user.token) {
    return (
      <main className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-gray-800">
          Please Sign in
        </div>
      </main>
    );
  }

  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null);
  const [user, setUser] = useState<string>("");
  const [coWorkingSpaces, setCoWorkingSpaces] = useState<CoWorkingSpaceItem[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile(session.user.token);
        setProfile(response.data);
        setUser(response.data._id);
      } catch (error) {
        console.error("Failed to fetch User Profile");
      }
    };

    const fetchCoWorkingSpaces = async () => {
      try {
        const response = await getCoWorkingSpaces(session.user.token);
        setCoWorkingSpaces(response.data);
      } catch (error) {
        console.error("Failed to fetch co-working spaces:", error);
      }
    };

    fetchUser();
    fetchCoWorkingSpaces();
    setLoading(false);
  }, []);

  const handleReservation = async () => {
    if (!session || !user || !selectedSpace || !reserveDate) {
      setMessage("All fields must be filled before submission.");
      return;
    }

    try {
      const response = await createReservation(
        session.user.token,
        reserveDate.toDate(),
        selectedSpace
      );

      if (!response.success) {
        setMessage(response.message);
        return;
      }

      alert("Reservation created successfully!");
    } catch (error) {
      setMessage("Unexpected Error Occured");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
      <div className="w-[40%] bg-white p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 border border-gray-300 mx-auto my-20">
        <div className="text-2xl font-bold">
          {profile?.role === "admin" ? "Admin Profile" : "User Profile"}
        </div>
        <table className="table-auto border-separate border-spacing-2 bg-gray-200 rounded-xl p-4">
          <tbody>
            <tr>
              <td className="text-md font-semibold text-black">Name</td>
              <td>{profile?.name}</td>
            </tr>
            <tr>
              <td className="text-md font-semibold text-black">Email</td>
              <td>{profile?.email}</td>
            </tr>
            <tr>
              <td className="text-md font-semibold text-black">Tel.</td>
              <td>{profile?.tel}</td>
            </tr>
            <tr>
              <td className="text-md font-semibold text-black">Member since</td>
              <td>{profile ? new Date(profile.createdAt).toString() : "N/A"}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-2xl font-bold">New Reservation</div>
        <div className="w-fit">
          <div className="text-md text-left font-semibold text-gray-600 mt-5">
            Reservation Information
          </div>
          <TextField
            variant="standard"
            name="User"
            label="User"
            value={profile?.name || ""}
            disabled
          />

          <div className="text-md text-left font-semibold text-gray-600 mt-5">
            Co-Working Space Selection
          </div>
          <Select
            variant="standard"
            id="CoWorkingSpace"
            className="h-[2em] w-[200px]"
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
          >
            {coWorkingSpaces.map((space) => (
              <MenuItem key={space._id} value={space._id}>
                {space.name}
              </MenuItem>
            ))}
          </Select>

          <div className="text-md text-left font-semibold text-gray-600 mt-5">
            Reservation Date
          </div>
          <DateReserve
            onDateChange={(value: Dayjs) => {
              setReserveDate(value);
            }}
          />
        </div>

        <Button variant="contained" color="primary" onClick={handleReservation}>
          Reserve Co-Working Space
        </Button>
        <p className="text-red-500 mt-3">{message}</p>
      </div>
    </main>
  );
}
