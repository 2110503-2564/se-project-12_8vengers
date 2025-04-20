export default async function checkUserRatingStatus(cid: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coworkingspaces/${cid}/rating-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to check rating status");
  
    return await res.json(); // { hasReserved: boolean, hasRated: boolean, rating: number }
  }
  