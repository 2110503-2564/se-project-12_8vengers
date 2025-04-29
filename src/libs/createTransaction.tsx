const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function createTransactions(amount: string, type: string, token: string) {
    const response = await fetch(`${BASE_URL}/api/v1/transactions`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: `${type}`,
        amount: parseInt(amount) 
      }),
    });
  
    return await response.json();
  }
  