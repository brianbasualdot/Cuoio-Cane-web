import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post('login')
    async login(@Body() body: { alias: string; code: string }) {
        return this.staffService.validateStaffLogin(body.alias, body.code);
    }

    @Post()
    async create(@Body() body: { alias: string; code: string }) {
        return this.staffService.createStaff(body.alias, body.code);
    }

    @Get()
    async list() {
        return this.staffService.getStaffList();
    }

    @Patch(':id/status')
    async toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
        return this.staffService.updateStaffStatus(id, isActive);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.staffService.deleteStaff(id);
    }
}
