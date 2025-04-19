export default async function getReview(token: string, reservationId: string) {
  if (!reservationId) {
    throw new Error("Missing reservationId");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reservationId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch review");
  }

  return await res.json();
}
