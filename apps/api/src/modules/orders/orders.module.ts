import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService], // Export for PaymentsModule
})
export class OrdersModule { }
