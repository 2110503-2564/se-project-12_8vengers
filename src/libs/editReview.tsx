export async function editReview(
    token: string,
    reservationId: string,
    comment: string
  ) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reservationId}`,
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
  