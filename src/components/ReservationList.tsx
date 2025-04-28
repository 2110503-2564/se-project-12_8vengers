"use client"
import { useEffect, useState } from "react";
import getReservations from "@/libs/getReservations";
import getCoworkingSpace from "@/libs/getCoworkingSpace";
import deleteReservation from "@/libs/deleteReservation";
import createTransactions from "@/libs/createTransaction";
import { ReservationItem } from "../../interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function ReservationList() {
  const [reservationItems, setReservationItems] = useState<ReservationItem[]>([]);
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

  if (!session || !session.user.token) {
    return (
      <main
        className="w-full h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}
      >
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center text-white text-2xl font-bold">
          Please Sign in
        </div>
      </main>
    );
  }

  if (loading)
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 text-lg">{error}</div>;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format

  return (
    <main className="w-[60%] bg-white p-6 rounded-lg shadow-6xl flex flex-col space-y-4 border border-gray-300 mx-auto my-20">
      <div className="text-2xl font-bold mb-5">Manage Reservations</div>
      {reservationItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No Co-Working Space Reservation
        </div>
      ) : (
        reservationItems.map((item) => {
          const reserveDate = new Date(item.reserveDate);
          const reserveDateStr = reserveDate.toISOString().split("T")[0]; // Get reserve date in "YYYY-MM-DD" format

          return (
            <div
              key={item._id}
              className="bg-gray-100 rounded-lg px-5 py-3 my-3 hover:shadow-lg"
            >
              <div className="text-lg font-semibold">
                User: {item.user.name}
              </div>
              <div className="text-md">
                Reserve Date: {item.reserveDate.toString()}
              </div>
              <div className="text-md">
                Co-Working Space: {item.coWorkingSpace.name}
              </div>

              <div className="flex justify-start mt-2">
                {/* Show Cancel and Edit buttons only if the reservation is after today */}
                {reserveDateStr === todayStr && (
                  <button
                    className="rounded-md bg-red-500 hover:bg-red-800 hover:text-white px-3 py-1 text-black shadow-sm text-sm mr-3"
                    onClick={async () => {
                      const confirmCancel = window.confirm("You will not receive a refund. Do you want to proceed?");
                      if (!confirmCancel) return; // ถ้าเลือก 'ยกเลิก' ใน popup ก็ไม่ทำอะไร

                      try {
                        await deleteReservation(item._id, session.user.token);
                        setReservationItems((prev) =>
                          prev.filter((res) => res._id !== item._id)
                        );
                        showSnackbar("Reservation canceled successfully (No refund)");
                      } catch (err: any) {
                        console.error("Failed to cancel reservation:", err);
                        showSnackbar(err?.response?.data?.message || "Failed to cancel reservation");
                      }
                    }}
                  >
                    Cancel Reservation
                  </button>
                )}

                {reserveDateStr > todayStr && (
                  <>
                    <button
                      className="rounded-md bg-red-500 hover:bg-red-800 hover:text-white px-3 py-1 text-black shadow-sm text-sm mr-3"
                      onClick={async () => {
                        try {
                          const coopJson = await getCoworkingSpace(item.coWorkingSpace._id, session.user.token);
                          const coopPrice = coopJson.data.price;
                          await createTransactions(coopPrice, "refund", session.user.token);
                          await deleteReservation(item._id, session.user.token);
                          setReservationItems((prev) =>
                            prev.filter((res) => res._id !== item._id)
                          );
                          showSnackbar("Reservation canceled and refunded successfully");
                        } catch (err: any) {
                          console.error("Failed to cancel reservation:", err);
                          showSnackbar(err?.response?.data?.message || "Failed to cancel or refund reservation");
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
                  </>
                )}

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
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </main>
  );
}