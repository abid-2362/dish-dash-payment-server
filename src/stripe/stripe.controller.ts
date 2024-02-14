import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}
  
  @Post('/payment-sheet')
  @UsePipes(ValidationPipe)
  async createPaymentSheet(@Body() body: any): Promise<any> {
    return this.stripeService.createPaymentSheet(body);
  }
}
