export default async function getCoworkingSpace(cid:string, token:string) {

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/coWorkingSpaces/${cid}`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to Fetch Co-Working Space")
    }
    
    return await response.json()
}