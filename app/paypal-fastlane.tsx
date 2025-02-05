"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import PaymentSuccess from "./components/payment-success";
import { OrderDetails } from "./types/paypal";
import PayPalButtonsWrapper from "./components/paypal-buttons-wrapper";
import ErrorMessage from "./components/error-message";
import { PaymentError, PAYMENT_ERROR_CODES } from "./utils/errors";

const PayPalFastlane = () => {
  const [email, setEmail] = useState("");
  const [clientToken, setClientToken] = useState("");
  const [tokenError, setTokenError] = useState<PaymentError | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  console.log("clientToken", clientToken);
  console.log("tokenError", tokenError);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch("/api/get-paypal-token");
        if (!response.ok) {
          throw new PaymentError(
            "Failed to initialize payment",
            PAYMENT_ERROR_CODES.TOKEN_ERROR,
            `Status: ${response.status}`
          );
        }
        const data = await response.json();
        if (!data.accessToken) {
          throw new PaymentError(
            "Invalid token response",
            PAYMENT_ERROR_CODES.TOKEN_ERROR
          );
        }
        setClientToken(data.accessToken);
      } catch (err) {
        setTokenError(
          err instanceof PaymentError
            ? err
            : new PaymentError(
                "Failed to initialize payment",
                PAYMENT_ERROR_CODES.TOKEN_ERROR,
                err instanceof Error ? err.message : String(err)
              )
        );
      }
    };
    getToken();
  }, []);

  if (tokenError) {
    return (
      <ErrorMessage
        title="Initialization Error"
        message={tokenError.message}
        details={tokenError.details}
        onRetry={() => window.location.reload()}
      />
    );
  }

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
          dataClientToken: clientToken,
          dataUserExperienceFlow: "NATIVE_CHECKOUT",
          dataPageType: "checkout",
          dataPartnerAttributionId: "FASTLANE",
          enableFunding: "card,credit,paylater,venmo",
          disableFunding: "sepa,bancontact,eps,giropay,ideal,mybank,p24,sofort",
          dataEmail: email,
          components: "buttons,funding-eligibility",
          commit: true,
          vault: false,
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
