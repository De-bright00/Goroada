import crypto from "crypto"
import { PaymentGateway, InitiatePaymentParams, InitiatePaymentResult, VerifyPaymentResult } from "./gateway.interface"

export class PaystackAdapter implements PaymentGateway {
  name = "paystack" as const
  private secretKey: string

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ""
  }

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const url = "https://api.paystack.co/transaction/initialize"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amountKobo,
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: {
          booking_id: params.bookingId,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Paystack initiation failed: ${errorText}`)
    }

    const result = await response.json()
    if (!result.status) {
      throw new Error(`Paystack initiation returned failed status: ${result.message}`)
    }

    return {
      authorizationUrl: result.data.authorization_url,
      gatewayReference: result.data.reference,
    }
  }

  async verify(gatewayReference: string): Promise<VerifyPaymentResult> {
    const url = `https://api.paystack.co/transaction/verify/${gatewayReference}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Paystack verification failed: ${errorText}`)
    }

    const result = await response.json()
    if (!result.status) {
      throw new Error(`Paystack verification returned failed status: ${result.message}`)
    }

    const data = result.data
    let status: "successful" | "failed" | "pending" = "pending"

    if (data.status === "success") {
      status = "successful"
    } else if (data.status === "failed") {
      status = "failed"
    } else if (data.status === "abandoned") {
      status = "failed"
    }

    return {
      status,
      amountKobo: data.amount,
      gatewayTransactionId: String(data.id),
      paidAt: data.paid_at || null,
    }
  }

  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    if (!signatureHeader) return false
    const hash = crypto
      .createHmac("sha512", this.secretKey)
      .update(rawBody)
      .digest("hex")
    return hash === signatureHeader
  }
}
