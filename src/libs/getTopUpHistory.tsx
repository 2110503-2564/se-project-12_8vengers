export default async function getTopUpHistory(userId: string, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/topup-history?userId=${userId}`, {
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
  