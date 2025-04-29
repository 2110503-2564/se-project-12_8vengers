const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getAverageRating(coWorkingSpaceId: string, token: string) {
  const url = `${BASE_URL}/api/v1/ratings/average/${coWorkingSpaceId}`;
  console.log("Fetching average rating from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Backend error response:", errText);
    throw new Error("Failed to fetch average rating");
  }

  const data = await response.json();
  console.log("Average rating response:", data);

  return {
    average: data.data.averageRating || 0,
    count: data.data.count || 0,
  };
}
