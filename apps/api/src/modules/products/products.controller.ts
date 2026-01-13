import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, createProductSchema, UpdateProductDto, updateProductSchema } from './products.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.productsService.findOne(slug);
    }

    @Post()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin', 'staff')
    @UsePipes(new ZodValidationPipe(createProductSchema))
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Patch(':id')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin', 'staff')
    @UsePipes(new ZodValidationPipe(updateProductSchema))
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles('admin', 'staff')
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
