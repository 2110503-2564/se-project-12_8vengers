const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getReview(token: string, coWorkingSpaceId: string) {

  const res = await fetch(`${BASE_URL}/api/v1/reviews/${coWorkingSpaceId}`, {
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
