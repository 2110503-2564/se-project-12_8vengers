export default async function getReviewsByCoop(token: string, coWorkingSpaceId: string) {
    if (!coWorkingSpaceId) {
      throw new Error("Missing coWorkingSpaceId");
    }
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/coworking/${coWorkingSpaceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }
  
    return await res.json();
  }
  