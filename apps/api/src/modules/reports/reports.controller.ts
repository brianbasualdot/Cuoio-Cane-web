import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
// Assuming we have an AuthGuard or AdminGuard. For now, validting path structure.
// If typical NestJS project here:
// import { AuthGuard } from '../../common/guards/auth.guard'; 

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('weekly')
    async getWeekly() {
        return this.reportsService.getWeeklyReport();
    }

    @Get('monthly')
    async getMonthly() {
        return this.reportsService.getMonthlyReport();
    }

    @Get('yearly')
    async getYearly() {
        return this.reportsService.getYearlyReport();
    }

    @Get('export')
    async getExport(
        @Query('period') period: 'week' | 'month' | 'year',
        @Query('format') format: 'pdf' | 'csv',
        @Res() res: Response
    ) {
        if (!['week', 'month', 'year'].includes(period) || !['pdf', 'csv'].includes(format)) {
            // @ts-ignore
            return res.status(400).send('Invalid parameters');
        }

        const stream = await this.reportsService.exportReport(period, format);

        if (format === 'pdf') {
            // @ts-ignore
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="report-${period}-${new Date().toISOString().split('T')[0]}.pdf"`,
            });
        } else {
            // @ts-ignore
            res.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="report-${period}-${new Date().toISOString().split('T')[0]}.csv"`,
            });
        }

        // @ts-ignore
        stream.pipe(res);
    }
}
