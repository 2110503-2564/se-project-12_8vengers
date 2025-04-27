import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  const { amount } = await req.json();

  const secretKey = process.env.OMISE_SECRET_KEY;
  const encodedKey = Buffer.from(secretKey + ":").toString("base64");

  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing authentication token' }, { status: 401 });
  }

  try {
    // Create Source (PromptPay)
    const sourceRes = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "thb",
        type: "promptpay",
      }),
    });

    const source = await sourceRes.json();
    if (source.object === "error") throw new Error(source.message);

    // Create Charge
    const chargeRes = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "thb",
        source: source.id,
        metadata: {
          token,
        },
      }),
    });

    const charge = await chargeRes.json();
    if (charge.object === "error") throw new Error(charge.message);

    return NextResponse.json({
      qrCode: charge.source.scannable_code.image.download_uri,
      chargeId: charge.id,
    });
  } catch (err: any) {
    console.error("❌ CHARGE ERROR:", err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
