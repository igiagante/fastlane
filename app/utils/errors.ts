export class PaymentError extends Error {
  constructor(message: string, public code?: string, public details?: string) {
    super(message);
    this.name = "PaymentError";
  }
}

export const PAYMENT_ERROR_CODES = {
  TOKEN_ERROR: "TOKEN_ERROR",
  ORDER_CREATE_ERROR: "ORDER_CREATE_ERROR",
  PAYMENT_PROCESSING_ERROR: "PAYMENT_PROCESSING_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;
