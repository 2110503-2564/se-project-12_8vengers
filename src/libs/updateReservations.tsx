export default async function updateReservation(rid: string, reserveDate: Date, token:string) {
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations/${rid}`, {
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