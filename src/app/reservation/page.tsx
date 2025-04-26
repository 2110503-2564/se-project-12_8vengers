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
import { useRef } from "react";

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
  const [showReservationDetails, setShowReservationDetails] = useState(false);

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
  const updateUserBalance = () => {
    if (profile && selectedSpaceObj) {
      const updatedBalance =
        Number(profile.balance ?? 0) - Number(selectedSpaceObj.price ?? 0);
      setProfile({ ...profile, balance: updatedBalance });
    }
  };
  const reservationInfoRef = useRef<HTMLDivElement>(null);

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

    } catch (error) {
      setMessage("Unexpected Error Occured");
    }
  };
  const handleConfirmPayment = async () => {
    const confirmed = window.confirm("Confirm payment?");
  
    if (confirmed) {
      await updateUserBalance();
      alert("Reservation created successfully!");
    } else {
      alert("You cancelled the payment.");
    }
  };
  
  

  if (loading) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  const selectedSpaceObj = coWorkingSpaces.find(space => space._id === selectedSpace);

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
      <div className="w-[40%] bg-white p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 border border-gray-300 mx-auto my-20">

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

        <Button variant="contained" color="primary" onClick={() => setShowReservationDetails(true)}>
          Reserve Co-Working Space
        </Button>
        
        {showReservationDetails && (
          <div ref={reservationInfoRef} className="w-[100%] table-auto border-separate border-spacing-2 bg-gray-200 rounded-xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-black">Reservation Details</h2>
            <table className="text-black">
              <tbody>
                <tr>
                  <td className="text-md font-semibold">Selected Space :</td>
                  <td>{selectedSpaceObj?.name}</td>
                </tr>
                <tr>
                  <td className="text-md font-semibold">Price :</td>
                  <td>{selectedSpaceObj?.price} Baht</td>
                </tr>
                <tr>
                  <td className="font-semibold">Current Balance :</td>
                  <td>{profile?.balance}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center items-center">
              <Button className="!bg-gray-700 !text-white !text-sm hover:!bg-gray-400 cursor-pointer" onClick={handleConfirmPayment}>
                Pay
              </Button>
            </div>
          </div>
        )}
        <p className="text-red-500 mt-3">{message}</p>
      </div>
    </main>
  );
}
