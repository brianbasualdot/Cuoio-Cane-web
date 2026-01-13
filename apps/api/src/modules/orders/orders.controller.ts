import { Body, Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, createOrderSchema } from './orders.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UsePipes(new ZodValidationPipe(createOrderSchema))
    // Auth is optional for Guest Checkout? 
    // User prompt said "Checkout Sin login obligatorio".
    // So we do NOT enforce SupabaseAuthGuard broadly.
    // We can try to extract user if present, or handle manually.
    async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        // If we want optional auth, we might need a custom decorator or check headers manually
        // For now, allow public access.
        // Ideally extract User ID from token if passed.

        // Simplification: We assume userId is passed implicitly if auth header exists, but Guard blocks if invalid.
        // If we want Optional Guard, we need a separate strategy.
        // For this step, we'll pass userID as null unless we implement "OptionalAuthGuard".

        return this.ordersService.create(createOrderDto, null);
    }
}
