import { PaymentGateway, InitiatePaymentParams, InitiatePaymentResult, VerifyPaymentResult } from "./gateway.interface"

export class FlutterwaveAdapter implements PaymentGateway {
  name = "flutterwave" as const
  private secretKey: string
  private webhookHash: string

  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || ""
    this.webhookHash = process.env.FLUTTERWAVE_HASH || "" // Set in dashboard as secret verification hash
  }

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const url = "https://api.flutterwave.com/v3/payments"
    // Flutterwave expects amount in major units (Naira, not kobo)
    const amountNaira = params.amountKobo / 100

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: params.reference,
        amount: amountNaira,
        currency: "NGN",
        redirect_url: params.callbackUrl,
        customer: {
          email: params.email,
        },
        meta: {
          booking_id: params.bookingId,
        },
        customizations: {
          title: "Goroada Trip Booking",
          description: "Payment for intercity bus trip ticket",
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Flutterwave initiation failed: ${errorText}`)
    }

    const result = await response.json()
    if (result.status !== "success") {
      throw new Error(`Flutterwave initiation returned failed status: ${result.message}`)
    }

    return {
      authorizationUrl: result.data.link,
      gatewayReference: params.reference,
    }
  }

  async verify(gatewayReference: string): Promise<VerifyPaymentResult> {
    const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${gatewayReference}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Flutterwave verification failed: ${errorText}`)
    }

    const result = await response.json()
    if (result.status !== "success") {
      throw new Error(`Flutterwave verification returned failed status: ${result.message}`)
    }

    const data = result.data
    let status: "successful" | "failed" | "pending" = "pending"

    if (data.status === "successful") {
      status = "successful"
    } else if (data.status === "failed") {
      status = "failed"
    }

    // Convert back from Naira to Kobo
    const amountKobo = Math.round(data.amount * 100)

    return {
      status,
      amountKobo,
      gatewayTransactionId: String(data.id),
      paidAt: data.created_at || null,
    }
  }

  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    // Flutterwave sends a verification hash header "verif-hash"
    if (!signatureHeader || !this.webhookHash) return false
    return signatureHeader === this.webhookHash
  }
}
