"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import PaymentSuccess from "./payment-success";
import { OrderDetails } from "../types/paypal";
import PayPalButtonsWrapper from "./paypal-buttons-wrapper";

const PayPalFastlane = () => {
  const [email, setEmail] = useState("");
  const [clientToken, setClientToken] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("/api/get-paypal-token");
      const data = await response.json();
      if (data.accessToken) {
        setClientToken(data.accessToken);
      }
    };
    getToken();
  }, []);

  if (paymentSuccess && orderDetails) {
    return (
      <PaymentSuccess
        orderDetails={orderDetails}
        onReset={() => {
          setPaymentSuccess(false);
          setOrderDetails(null);
          setEmail("");
        }}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Complete Your Purchase</h2>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your email"
        />
      </div>

      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: "USD",
          intent: "capture",
          clientToken: clientToken,
          components: "buttons,fastlane,funding-eligibility,card-fields",
          enableFunding: "card,credit,paylater,venmo",
          disableFunding: "sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort",
          dataUserExperienceFlow: "NATIVE_CHECKOUT",
          dataPageType: "checkout",
          dataPartnerAttributionId: "FASTLANE",
          dataPopup: false,
          dataDisplayType: "drawer",
          dataUserIdToken: email,
          dataNamespace: "PayPalSDK",
        }}
      >
        <PayPalButtonsWrapper
          email={email}
          setOrderDetails={setOrderDetails}
          setPaymentSuccess={setPaymentSuccess}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalFastlane;
