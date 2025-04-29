const isBrowser = typeof window !== "undefined";

const BASE_URL = isBrowser
  ? "http://localhost:5003"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function userRegister(userName: string, userEmail: string, userTel: string, userPassword: string, role: string) {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {  
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword,
            tel: userTel,
            role: role
        }), 
    });

    return response; 
}