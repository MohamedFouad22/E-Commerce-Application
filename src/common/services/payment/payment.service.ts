import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createSession({
    success_url = process.env.SUCCESS_URL as string,
    cancel_url = process.env.CANCEL_URL as string,
    metadata = {},
    line_items,
    mode = 'payment',
    customer_email,
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      success_url,
      cancel_url,
      metadata,
      line_items,
      mode,
      customer_email,
      discounts,
    });
    return session;
  }
}
