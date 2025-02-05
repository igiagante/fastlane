import { render, screen } from "@testing-library/react";
import {
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import PayPalButtonsWrapper from "../paypal-buttons-wrapper";

// Mock the entire module
jest.mock("@paypal/react-paypal-js", () => ({
  ...jest.requireActual("@paypal/react-paypal-js"),
  usePayPalScriptReducer: jest.fn().mockReturnValue([
    {
      isPending: false,
      isRejected: false,
    },
  ]),
  PayPalButtons: () => <div data-testid="paypal-button">PayPal Button</div>,
}));

describe("PayPalButtonsWrapper", () => {
  const mockProps = {
    email: "test@example.com",
    amount: "100.00",
    setOrderDetails: jest.fn(),
    setPaymentSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton when script is pending", () => {
    (usePayPalScriptReducer as jest.Mock).mockReturnValue([
      { isPending: true },
    ]);

    const { container } = render(
      <PayPalScriptProvider options={{ clientId: "test-client-id" }}>
        <PayPalButtonsWrapper {...mockProps} />
      </PayPalScriptProvider>
    );

    expect(container.querySelector(".space-y-4")).toBeInTheDocument();
  });

  it("renders PayPal buttons when script loads", () => {
    (usePayPalScriptReducer as jest.Mock).mockReturnValue([
      { isPending: false },
    ]);

    render(
      <PayPalScriptProvider options={{ clientId: "test-client-id" }}>
        <PayPalButtonsWrapper {...mockProps} />
      </PayPalScriptProvider>
    );

    expect(screen.getByTestId("paypal-button")).toBeInTheDocument();
  });

  it("shows error message when script fails to load", () => {
    (usePayPalScriptReducer as jest.Mock).mockReturnValue([
      { isRejected: true },
    ]);

    render(
      <PayPalScriptProvider options={{ clientId: "test-client-id" }}>
        <PayPalButtonsWrapper {...mockProps} />
      </PayPalScriptProvider>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });
});
