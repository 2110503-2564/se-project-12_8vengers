"use client";
import { useEffect, useState } from "react";
import getReservations from "@/libs/getReservations";
import deleteReservation from "@/libs/deleteReservation";
import rateReservation from "@/libs/rateReservation";
import getAverageRating from "@/libs/avgRating";
import { ReservationItem } from "../../interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function ReservationList() {
  const [reservationItems, setReservationItems] = useState<ReservationItem[]>([]);
  const [ratingMap, setRatingMap] = useState<{ [id: string]: number }>({});
  const [avgRatingMap, setAvgRatingMap] = useState<{
    [coId: string]: { average: number; count: number };
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservations(session?.user.token || "");
        const data = Array.isArray(response.data) ? response.data.flat() : [];
        setReservationItems(data);

        const initialRatings: { [id: string]: number } = {};
        const avgRatings: { [coId: string]: { average: number; count: number } } = {};

        await Promise.all(
          data.map(async (item: ReservationItem) => {
            initialRatings[item._id] = item.rating || 0;

            try {
              const avg = await getAverageRating(item.coWorkingSpace._id, session?.user.token || "");
              avgRatings[item.coWorkingSpace._id] = {
                average: avg.average || 0,
                count: avg.count || 0,
              };
            } catch (err) {
              avgRatings[item.coWorkingSpace._id] = {
                average: 0,
                count: 0,
              };
            }
          })
        );

        setRatingMap(initialRatings);
        setAvgRatingMap(avgRatings);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.token) {
      fetchReservations();
    }
  }, [session?.user.token]);

  const handleRatingChange = async (reservationId: string, coId: string, newRating: number) => {
    const hasRatedBefore = ratingMap[reservationId] && ratingMap[reservationId] > 0;

    try {
      await rateReservation(reservationId, newRating, session?.user.token || "");
      setRatingMap((prev) => ({ ...prev, [reservationId]: newRating }));

      const newAvg = await getAverageRating(coId, session?.user.token || "");
      setAvgRatingMap((prev) => ({
        ...prev,
        [coId]: {
          average: newAvg.average || 0,
          count: newAvg.count || 0,
        },
      }));

      showSnackbar(
        hasRatedBefore
          ? "You've already rated this reservation"
          : "Rating submitted successfully!"
      );
    } catch (err) {
      console.error("Failed to update rating:", err);
      showSnackbar("Failed to submit rating");
    }
  };

  if (!session || !session.user.token) {
    return (
      <main className="w-full h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/img/background.avif')" }}>
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center text-white text-2xl font-bold">
          Please Sign in
        </div>
      </main>
    );
  }

  if (loading) return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-lg">{error}</div>;

  return (
    <main className="w-[60%] bg-white p-6 rounded-lg shadow-6xl flex flex-col space-y-4 border border-gray-300 mx-auto my-20">
      <div className="text-2xl font-bold mb-5">Manage Reservations</div>
      {reservationItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No Co-Working Space Reservation</div>
      ) : (
        reservationItems.map((item) => {
          const avgData = avgRatingMap[item.coWorkingSpace._id];
          return (
            <div key={item._id} className="bg-gray-100 rounded-lg px-5 py-3 my-3 hover:shadow-lg">
              <div className="text-lg font-semibold">User: {item.user.name}</div>
              <div className="text-md">Reserve Date: {item.reserveDate.toString()}</div>
              <div className="text-md">Co-Working Space: {item.coWorkingSpace.name}</div>
              <div className="text-md text-gray-700 mt-1">
                ⭐ Average Rating: {avgData?.average.toFixed(2) ?? "N/A"} ({avgData?.count ?? 0} ratings)
              </div>
              <div className="flex justify-start mt-2">
                <button
                  className="rounded-md bg-red-500 hover:bg-red-800 hover:text-white px-3 py-1 text-black shadow-sm text-sm mr-3"
                  onClick={async () => {
                    try {
                      await deleteReservation(item._id, session.user.token);
                      setReservationItems((prev) => prev.filter((res) => res._id !== item._id));
                      const updatedAvgRating = await getAverageRating(item.coWorkingSpace._id, session?.user.token || "");
                      setAvgRatingMap((prev) => ({
                        ...prev,
                        [item.coWorkingSpace._id]: {
                          average: updatedAvgRating.average || 0,
                          count: updatedAvgRating.count || 0,
                        },
                      }));
                      showSnackbar("Reservation cancelled successfully!");
                    } catch (err) {
                      console.error("Failed to delete reservation:", err);
                      showSnackbar("Failed to cancel reservation");
                    }
                  }}
                >
                  Cancel Reservation
                </button>

                <button
                  className="rounded-md bg-blue-600 hover:bg-green-600 px-3 py-1 text-white shadow-sm text-sm mr-3"
                  onClick={() => {
                    sessionStorage.setItem("coWorkingSpace", JSON.stringify(item.coWorkingSpace));
                    sessionStorage.setItem("userName", JSON.stringify(item.user));
                    router.push(`/myreservation/${item._id}`);
                  }}
                >
                  Edit Reservation
                </button>
                <div className="flex items-center justify-end flex-1">
                  <span className="text-md font-medium mr-2">Rate:</span>
                  <Rating
                    name={`rating-${item._id}`}
                    value={ratingMap[item._id] ?? 0}
                    onChange={(_, newValue) => {
                      if (newValue !== null) {
                        handleRatingChange(item._id, item.coWorkingSpace._id, newValue);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </main>
  );
}
