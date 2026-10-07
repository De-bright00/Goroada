import { PaymentGateway } from "./gateway.interface"
import { PaystackAdapter } from "./paystack.adapter"

export class PaymentGatewayFactory {
  static getGateway(name: "paystack"): PaymentGateway {
    switch (name) {
      case "paystack":
        return new PaystackAdapter()
      default:
        throw new Error(`Unsupported payment gateway: ${name}`)
    }
  }
}
