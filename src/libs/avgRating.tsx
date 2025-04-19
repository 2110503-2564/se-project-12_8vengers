export default async function getAverageRating(coworkingSpaceId: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/average/${coworkingSpaceId}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch average rating");
  }

  const data = await response.json();
  return data.average || 0;
}
