import { OrderDetails } from "../types/paypal";

type PaymentSuccessProps = {
  orderDetails: OrderDetails;
  onReset: () => void;
};

const PaymentSuccess = ({ orderDetails, onReset }: PaymentSuccessProps) => {
  return (
    <div className="max-w-md mx-auto p-8 border rounded-lg shadow-sm bg-green-50">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>
        <div className="text-left bg-white p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Order Details:</h3>
          <p className="text-sm text-gray-600">Order ID: {orderDetails.id}</p>
          <p className="text-sm text-gray-600">
            Amount: $
            {orderDetails.purchase_units[0].payments.captures[0].amount.value}{" "}
            USD
          </p>
          {orderDetails.payer?.name && (
            <p className="text-sm text-gray-600">
              Payer: {orderDetails.payer?.name?.given_name}{" "}
              {orderDetails.payer?.name?.surname}
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Make Another Purchase
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
