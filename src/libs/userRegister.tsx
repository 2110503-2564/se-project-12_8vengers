export default async function userRegister(userName: string, userEmail: string, userTel: string, userPassword: string, role: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {  
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