const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getTopUpHistory(userId: string, token: string) {
    const response = await fetch(`${BASE_URL}/api/topup-history?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to Fetch Top-Up History");
    }
  
    return await response.json();
  }
  