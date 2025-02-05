import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { OrderDetails } from "../types/paypal";
import PaypalButtonsSkeleton from "./paypal-buttons-skeleton";

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

  const isValidEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  if (isRejected) {
    return (
      <div data-testid="error-message" className="text-red-500">
        Failed to load PayPal. Please refresh and try again.
      </div>
    );
  }

  return isPending ? (
    <PaypalButtonsSkeleton />
  ) : (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "rect",
      }}
      disabled={!isValidEmail(email)}
      createOrder={async () => {
        const response = await fetch("/api/create-paypal-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: "100.00", email }),
        });
        const order = await response.json();
        return order.id;
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          setOrderDetails(details as unknown as OrderDetails);
          setPaymentSuccess(true);
        }
      }}
    />
  );
};

export default PayPalButtonsWrapper;
