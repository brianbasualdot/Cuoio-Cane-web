import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [DiscountsController],
    providers: [DiscountsService],
    exports: [DiscountsService],
})
export class DiscountsModule { }
