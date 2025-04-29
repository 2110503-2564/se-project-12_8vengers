const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function updateReservation(rid: string, reserveDate: Date, token:string) {
    
    const response = await fetch(`${BASE_URL}/api/v1/reservations/${rid}`, {
        method: "PUT",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            reserveDate:reserveDate,
        }), 
    })

    return await response.json()
}