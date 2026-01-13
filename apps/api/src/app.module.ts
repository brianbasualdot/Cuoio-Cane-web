import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { SupabaseModule } from './supabase/supabase.module';
import { ProductsModule } from './modules/products/products.module';

import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true,
        }),
        SupabaseModule,
        ProductsModule,
        OrdersModule,
        PaymentsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
