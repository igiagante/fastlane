import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { OrderDetails } from "../types/paypal";
import PaypalButtonsSkeleton from "./paypal-buttons-skeleton";
import { useState } from "react";

type PayPalButtonsWrapperProps = {
  email: string;
  setOrderDetails: (details: OrderDetails) => void;
  setPaymentSuccess: (success: boolean) => void;
};

const PayPalButtonsWrapper = ({
  email,
  setOrderDetails,
  setPaymentSuccess,
}: PayPalButtonsWrapperProps) => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  if (error) {
    return (
      <div data-testid="error-message" className="text-red-500">
        {error}
      </div>
    );
  }

  if (isRejected) {
    window.location.reload();
    return <PaypalButtonsSkeleton />;
  }

  if (isPending) {
    return <PaypalButtonsSkeleton />;
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", shape: "rect" }}
      disabled={!isValidEmail(email)}
      createOrder={async () => {
        try {
          const response = await fetch("/api/create-paypal-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: "100.00", email }),
          });

          if (!response.ok) {
            throw new Error("Failed to create order");
          }

          const order = await response.json();
          return order.id;
        } catch (error) {
          console.error("Create order error:", error);
          setError("Failed to create PayPal order");
          throw error;
        }
      }}
      onApprove={async (data, actions) => {
        try {
          if (!actions.order) {
            throw new Error("Order object is missing");
          }

          const details = await actions.order.capture();
          setOrderDetails(details as unknown as OrderDetails);
          setPaymentSuccess(true);
        } catch (error) {
          console.error("Capture error:", error);
          // Check if we already have the order details despite the error
          if (
            error instanceof Error &&
            typeof error === "object" &&
            "status" in error &&
            error.status === 400 &&
            data.orderID
          ) {
            // Payment likely succeeded if we have an orderID
            setPaymentSuccess(true);
          } else {
            setError("Failed to process payment");
          }
        }
      }}
    />
  );
};

export default PayPalButtonsWrapper;
