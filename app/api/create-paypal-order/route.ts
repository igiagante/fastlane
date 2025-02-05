import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, email } = await request.json();

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount,
              },
            },
          ],
          payment_source: {
            paypal: {
              email_address: email,
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Error creating PayPal order" },
      { status: 500 }
    );
  }
}
