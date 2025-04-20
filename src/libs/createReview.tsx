export default async function createReview(
  token: string,
  comment: string,
  coWorkingSpaceId: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${coWorkingSpaceId}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment,
      }),
    }
  );

  return await response.json();
}

