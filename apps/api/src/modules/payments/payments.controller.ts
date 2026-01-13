import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('init/:orderId')
    initPayment(@Param('orderId') orderId: string) {
        return this.paymentsService.initPayment(orderId);
    }

    @Post('webhook')
    handleWebhook(@Query() query: any, @Body() body: any) {
        return this.paymentsService.handleWebhook(query, body);
    }
}
