const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"  // ฝั่ง browser ยิง localhost
  : process.env.NEXT_PUBLIC_BACKEND_URL; // ฝั่ง server (Next.js server components) ยิง backend

export default async function getUserProfile(token: string) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error("Cannot get user profile");
  }

  return await response.json();
}
