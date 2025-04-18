"use client";
import { useEffect, useState } from "react";
import getReservations from "@/libs/getReservations";
import deleteReservation from "@/libs/deleteReservation";
import { ReservationItem } from "../../interface";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ReservationList() {
  const [reservationItems, setReservationItems] = useState<ReservationItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || !session.user.token) {
    return (
      <main
        className="w-full h-screen flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/background.avif')" }}
      >
        <div className="w-[20%] bg-red-600 p-6 rounded-lg shadow-6xl flex flex-col items-center space-y-4 mx-auto my-20 font-bold text-2xl text-gray-800">
          Please Sign in
        </div>
      </main>
    );
  }

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservations(session.user.token);
        setReservationItems(
          Array.isArray(response.data) ? response.data.flat() : []
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <main
      className="w-[60%] bg-white p-6 rounded-lg shadow-6xl flex flex-col
         space-y-4 border border-gray-300 mx-auto my-20"
    >
      <div className="mx-5 my-5">
        <div className="text-2xl font-bold m-3">Manage Reservations</div>
        {reservationItems.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No Co-Working Space Reservation
          </div>
        ) : (
          reservationItems.map((item) => (
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
                <button
                  className="rounded-md bg-red-500 hover:bg-red-800 hover:text-white px-3 py-1 text-black shadow-sm text-sm mr-3"
                  onClick={async () => {
                    try {
                      await deleteReservation(item._id, session.user.token);

                      setReservationItems((prevItems) =>
                        prevItems.filter((res) => res._id !== item._id)
                      );
                    } catch (err) {
                      console.error("Failed to delete reservation:", err);
                    }
                  }}
                >
                  Cancel Reservation
                </button>
                <button
                  className="rounded-md bg-blue-600 hover:bg-green-600 px-3 py-1 text-white shadow-sm text-sm mr-3"
                  onClick={() => {
                    sessionStorage.setItem(
                      "coWorkingSpace",
                      JSON.stringify(item.coWorkingSpace)
                    );
                    sessionStorage.setItem(
                      "userName",
                      JSON.stringify(item.user)
                    );
                    router.push(`/myreservation/${item._id}`);
                  }}
                >
                  Edit Reservation
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
