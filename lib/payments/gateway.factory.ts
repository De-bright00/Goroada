import { PaymentGateway } from "./gateway.interface"
import { PaystackAdapter } from "./paystack.adapter"
import { FlutterwaveAdapter } from "./flutterwave.adapter"

export class PaymentGatewayFactory {
  static getGateway(name: "paystack" | "flutterwave"): PaymentGateway {
    switch (name) {
      case "paystack":
        return new PaystackAdapter()
      case "flutterwave":
        return new FlutterwaveAdapter()
      default:
        throw new Error(`Unsupported payment gateway: ${name}`)
    }
  }
}
