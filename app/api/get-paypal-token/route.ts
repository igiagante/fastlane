import { NextResponse } from "next/server";

export async function GET() {
  try {
    // First, get an access token
    const authResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      throw new Error("Failed to get access token");
    }

    // Then, use the access token to generate a client token
    const clientTokenResponse = await fetch(
      "https://api-m.sandbox.paypal.com/v1/identity/generate-token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const tokenData = await clientTokenResponse.json();

    if (!clientTokenResponse.ok) {
      throw new Error("Failed to generate client token");
    }

    return NextResponse.json({ accessToken: tokenData.client_token });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error generating token" },
      { status: 500 }
    );
  }
}
