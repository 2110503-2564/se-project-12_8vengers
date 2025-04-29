const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function updateReview(
    token: string,
    reviewId: string,
    comment: string
  ) {
    const res = await fetch(
      `${BASE_URL}/api/v1/reviews/${reviewId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      }
    );
  
    return await res.json();
  }
  