import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chargeId = searchParams.get('chargeId');
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  const secretKey = process.env.OMISE_SECRET_KEY;
  const encodedKey = Buffer.from(secretKey + ":").toString("base64");

  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing authentication token' }, { status: 401 });
  }

  try {
    //ดึงข้อมูล charge เดิม
    const chargeRes = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${encodedKey}`,
      },
    });

    const charge = await chargeRes.json();

    if (charge.object === "error") throw new Error(charge.message);

    if (charge.status === "successful") {
      //update balance
      const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/updateBalance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: charge.amount,
          chargeId: charge.id,
        }),
      });

      const backendData = await backendRes.json();

      if (!backendRes.ok) throw new Error(backendData.message);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Payment not completed yet" });
    }
  } catch (err: any) {
    console.error("❌ CHECK PAYMENT ERROR:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
