import { Body, Controller, Post } from '@nestjs/common';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
    constructor(private readonly discountsService: DiscountsService) { }

    @Post('validate')
    async validate(@Body() body: { code: string; total: number; itemIds: string[] }) {
        return this.discountsService.validateCoupon(body.code, body.total, body.itemIds);
    }
}
