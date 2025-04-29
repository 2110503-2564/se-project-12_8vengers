const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function editReview(
    token: string,
    reviewId: string,
    comment: string
  ) {
    const response = await fetch(
      `${BASE_URL}/api/v1/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to update review");
    }
  
    return await response.json();
  }
  