const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;
  
export default async function getReservation(rid: string, token: string) {
    const response = await fetch(
      `${BASE_URL}/api/v1/reservations/${rid}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },  
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to get Reservation");
    }
  
    const data = await response.json();
    console.log("Reservation:", data);
    return data;
  }