export default async function getReservations(token: string) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/reservations`,
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

  return data;
}
