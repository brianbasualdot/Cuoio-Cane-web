import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { SupabaseModule } from './supabase/supabase.module';
import { ProductsModule } from './modules/products/products.module';

import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { ReportsModule } from './modules/reports/reports.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true,
            ignoreEnvFile: process.env.NODE_ENV === 'production',
        }),
        SupabaseModule,
        ProductsModule,
        OrdersModule,
        PaymentsModule,
        DiscountsModule,
        ReportsModule,
        StaffModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
