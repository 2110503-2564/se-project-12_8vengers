const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function createReservation(
    token: string,
    reserveDate: Date,
    coWorkingSpace: string
  ) {
    const response = await fetch(`${BASE_URL}/api/v1/coWorkingSpaces/${coWorkingSpace}/reservations`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({
        reserveDate: reserveDate.toISOString() 
      }), 
    });
  
    return await response.json();
  }