const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getCoWorkingSpaces(token:string) {

    const response = await fetch(`${BASE_URL}/api/v1/coWorkingSpaces`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to Fetch Co-Working Spaces")
    }
    
    return await response.json()
}