const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function deleteReview(
    token: string,
    reviewId: string
  ) {
    const response = await fetch(
      `${BASE_URL}/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  
    return response;
  }
  