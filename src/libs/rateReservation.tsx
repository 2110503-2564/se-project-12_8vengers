export default async function rateReservation(rid: string, rating: number, token: string) {
    console.log("Sending rating:", rating);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${rid}/rate`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
      }),
    });
    const data = await response.json();
    console.log("Response data:", data); // log ตอบกลับจาก backend
    return data;
    //return await response.json();
  }
  