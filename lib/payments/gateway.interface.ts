export interface InitiatePaymentParams {
  bookingId: string;
  reference: string;      // our idempotency key, e.g. booking_reference
  amountKobo: number;     // always smallest currency unit (kobo)
  email: string;
  callbackUrl: string;
}

export interface InitiatePaymentResult {
  authorizationUrl: string; // where we redirect the passenger to pay
  gatewayReference: string;
}

export interface VerifyPaymentResult {
  status: "successful" | "failed" | "pending";
  amountKobo: number;
  gatewayTransactionId: string;
  paidAt: string | null;
}

export interface PaymentGateway {
  name: "paystack";
  initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;
  verify(gatewayReference: string): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean;
}
