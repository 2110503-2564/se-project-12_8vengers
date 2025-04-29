const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function rateVenue(cid: string, rating: number, token: string) {
  console.log("Sending rating:", rating);
  const response = await fetch(`${BASE_URL}/api/v1/coWorkingSpaces/${cid}/rate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating }),
  });

  const data = await response.json();
  console.log("Response data:", data);
  return data;
}
