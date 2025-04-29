const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function userLogIn(userEmail:string, userPassword:string) {
    
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`
        , {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:userEmail,
            password:userPassword
        }), 
    })

    if (!response.ok) {
        throw new Error("Failed to login")
    } 

    return await response.json()
}