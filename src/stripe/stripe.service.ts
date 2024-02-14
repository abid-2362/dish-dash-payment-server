import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Stripe} from 'stripe'


@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private configService: ConfigService) {
    const stripeSecretKey = configService.get("STRIPE_SECRET_KEY")
    console.log("stripe.service.ts", stripeSecretKey);
    this.stripe = new Stripe(stripeSecretKey);
  }
  
  async createPaymentSheet(body: any): Promise<any> {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await this.stripe.customers.create();
    const ephemeralKey = await this.stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2020-08-27'}
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    };
  }
  
}
