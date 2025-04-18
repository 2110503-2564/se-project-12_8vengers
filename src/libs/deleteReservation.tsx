export default async function deleteReservation(rid: string, token:string) {
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations/${rid}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`
        }, 
    })

    if (!response.ok) {
        throw new Error("Failed to delete Reservation")
      }

    return await response.json()
}