export default async function updateReview(
    token: string,
    reviewId: string,
    comment: string
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}`,
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
  