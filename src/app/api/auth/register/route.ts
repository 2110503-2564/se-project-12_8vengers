import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, tel, password, role } = await req.json();

        if (!name || !email || !tel || !password || !role) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const externalRes = await fetch("https://cws-backend-five.vercel.app/api/v1/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, tel, password, role }),
        });

        const data = await externalRes.json();

        if (!externalRes.ok) {
            return NextResponse.json({ error: data.error || "Failed to register" }, { status: externalRes.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
