import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { Readable } from 'stream';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) { }

    async exportReport(period: 'week' | 'month' | 'year', format: 'pdf' | 'csv') {
        const data = await this.getReportData(period);

        if (format === 'pdf') {
            return this.generatePDF(data, period);
        } else if (format === 'csv') {
            return this.generateCSV(data);
        } else {
            throw new BadRequestException('Invalid format');
        }
    }

    private generateCSV(data: any): Readable {
        // Flatten data for CSV
        // We will create a summary row, then sections. 
        // Actually, CSV is best for raw data. Let's make it a flat summary + breakdown?
        // User said: "Datos planos, Encabezados claros, Un archivo por período".
        // Fields: ventas totales, ventas netas, ticket promedio, top productos, localidades.
        // Putting all this in one CSV is messy. Let's do a columnar approach or just Key-Value for summary and then list products.
        // A common approach for dashboard export is generating multiple CSVs or one complex one. 
        // Let's try to fit it in one:
        // Section, Item, Value/Quantity, Revenue

        const rows = [];

        // Summary Section
        rows.push({ Section: 'RESUMEN', Item: 'Ventas Totales', Value: data.sales.totalCount, Revenue: data.sales.totalRevenue });
        rows.push({ Section: 'RESUMEN', Item: 'Ventas Netas', Value: data.sales.totalCount - data.sales.cancelledCount, Revenue: data.sales.netRevenue });
        rows.push({ Section: 'RESUMEN', Item: 'Cancelados', Value: data.sales.cancelledCount, Revenue: data.sales.cancelledRevenue });
        rows.push({ Section: 'RESUMEN', Item: 'Ticket Promedio', Value: data.sales.averageTicket, Revenue: '' });

        // Products Section
        data.products.byRevenue.forEach((p: any, index: number) => {
            rows.push({ Section: 'TOP PRODUCTOS', Item: p.name, Value: p.quantity, Revenue: p.revenue });
        });

        // Locations Section
        data.locations.forEach((l: any) => {
            rows.push({ Section: 'TOP LOCALIDADES', Item: l.name, Value: l.count, Revenue: '' });
        });

        const json2csvParser = new Parser({ fields: ['Section', 'Item', 'Value', 'Revenue'] });
        const csv = json2csvParser.parse(rows);

        const stream = new Readable();
        stream.push(csv);
        stream.push(null);
        return stream;
    }

    private generatePDF(data: any, period: string): Readable {
        const doc = new PDFDocument({ margin: 50 });
        const stream = new Readable();

        // Pipe PDF to readable stream logic
        // We need to capture the buffer or push chunks. 
        // Creating a pass-through stream is cleaner usually, but here is a simple buffer wrap:
        // Actually, doc.pipe() expects a Writable. 
        // Let's return the doc instance itself (which is a readable node stream in pdfkit) 
        // wrapped or handled by controller.
        // BUT ReportsController needs a stream. PDFDocument extends NodeJS.ReadableStream (in types commonly).
        // Let's check pdfkit docs. Yes, it's a stream.

        // However, to return it safely to Nest, we often treat it as a stream.

        doc.fontSize(20).text('Cuoio Cane - Reporte de Gestión', { align: 'center' });
        doc.fontSize(12).moveDown();
        doc.text(`Período: ${period.toUpperCase()}`, { align: 'center' });
        doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, { align: 'center' });
        doc.moveDown(2);

        // Sales Section
        doc.fontSize(16).text('Ventas', { underline: true });
        doc.fontSize(12).moveDown(0.5);
        this.addPdfRow(doc, 'Ventas Totales', `$${data.sales.totalRevenue.toLocaleString('es-AR')} (${data.sales.totalCount})`);
        this.addPdfRow(doc, 'Ventas Netas', `$${data.sales.netRevenue.toLocaleString('es-AR')}`);
        this.addPdfRow(doc, 'Ticket Promedio', `$${data.sales.averageTicket.toLocaleString('es-AR')}`);
        this.addPdfRow(doc, 'Cancelados', `$${data.sales.cancelledRevenue.toLocaleString('es-AR')} (${data.sales.cancelledCount})`);
        doc.moveDown();

        // Products Section
        doc.fontSize(16).text('Top Productos', { underline: true });
        doc.fontSize(12).moveDown(0.5);
        data.products.byRevenue.slice(0, 10).forEach((p: any, i: number) => {
            this.addPdfRow(doc, `${i + 1}. ${p.name}`, `${p.quantity} un. | $${p.revenue.toLocaleString('es-AR')}`);
        });
        doc.moveDown();

        // Locations Section
        doc.fontSize(16).text('Top Localidades', { underline: true });
        doc.fontSize(12).moveDown(0.5);
        data.locations.slice(0, 10).forEach((l: any, i: number) => {
            this.addPdfRow(doc, `${i + 1}. ${l.name}`, `${l.count} envíos`);
        });

        doc.end();
        return doc as unknown as Readable; // PDFKit is a stream
    }

    private addPdfRow(doc: PDFDocument, label: string, value: string) {
        doc.text(`${label}: ${value}`);
    }

    async getWeeklyReport() {
        return this.getReportData('week');
    }

    async getMonthlyReport() {
        return this.getReportData('month');
    }

    async getYearlyReport() {
        return this.getReportData('year');
    }

    private async getReportData(period: 'week' | 'month' | 'year') {
        const now = new Date();
        let startDate = new Date();

        // Calculate start date based on period
        if (period === 'week') {
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
            startDate.setDate(diff); // Set to monday of this week
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        }

        const startDateISO = startDate.toISOString();
        const endDateISO = new Date().toISOString();

        this.logger.log(`Fetching report for period: ${period} from ${startDateISO}`);

        // Fetch Orders
        const { data: orders, error } = await this.supabase
            .from('orders')
            .select(`
                id,
                total_amount,
                items_subtotal,
                status,
                created_at,
                shipping_address,
                order_items (
                    quantity,
                    unit_price,
                    product_name,
                    product_variant_id
                )
            `)
            .gte('created_at', startDateISO)
            .lte('created_at', endDateISO);

        if (error) {
            this.logger.error('Error fetching orders for report', error);
            throw new Error('Failed to generate report');
        }

        // --- Aggregations ---

        // 1. Sales Stats
        const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'paid' || o.status === 'delivered'); // Adjust statuses as needed
        const cancelledOrders = orders.filter(o => o.status === 'cancelled' || o.status === 'rejected');

        // Note: Using 'completed' related statuses for Revenue. 
        // If the user wants ALL sales regardless of status (except cancelled), we'd adjust.
        // Assuming "Ventas Realizadas" means successful sales.

        const totalSalesCount = completedOrders.length;
        const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        const cancelledCount = cancelledOrders.length;
        const cancelledAmount = cancelledOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        // Net Sales (Revenue - Cancelled is usually Revenue if we only sum completed, but let's follow the request "Ventas netas")
        // "Ventas netas" usually means Gross Sales - Returns/Cancellations. 
        // Since we only summed completed orders for Total Revenue, that IS the Net Revenue effectively (unless we count pending/processing).
        // Let's assume:
        // Ventas Totales = All orders (that are not cancelled initially? Or all attempts?)
        // Let's redefine for clarity:
        // Total Sales (Volume): Count of completed orders.
        // Net Sales (Value): Sum of completed orders amount.

        const values = completedOrders.map(o => Number(o.total_amount) || 0);
        const minVal = values.length ? Math.min(...values) : 0;
        const maxVal = values.length ? Math.max(...values) : 0;
        const avgTicket = totalSalesCount ? totalRevenue / totalSalesCount : 0;

        // 2. Products Stats (Top Selling)
        const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {};

        completedOrders.forEach(order => {
            // @ts-ignore - Supabase types might be tricky with nested arrays
            order.order_items?.forEach((item: any) => {
                const key = item.product_name; // Or variant ID if we want variant level
                if (!productStats[key]) {
                    productStats[key] = { name: item.product_name, quantity: 0, revenue: 0 };
                }
                productStats[key].quantity += item.quantity;
                productStats[key].revenue += (item.unit_price * item.quantity);
            });
        });

        const productsArray = Object.values(productStats);
        const topByQuantity = [...productsArray].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
        const topByRevenue = [...productsArray].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // 3. Locations Stats
        const locationStats: Record<string, number> = {};

        completedOrders.forEach(order => {
            const addr = order.shipping_address as any; // JSONB
            // Assuming standard address object: { city: "...", province: "...", ... }
            if (addr && addr.city) {
                const loc = `${addr.city}, ${addr.province || ''}`;
                locationStats[loc] = (locationStats[loc] || 0) + 1;
            } else if (addr && addr.province) {
                const loc = addr.province;
                locationStats[loc] = (locationStats[loc] || 0) + 1;
            }
        });

        const topLocations = Object.entries(locationStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            period,
            sales: {
                totalCount: totalSalesCount,
                totalRevenue: totalRevenue,
                cancelledCount: cancelledCount,
                cancelledRevenue: cancelledAmount, // Just for info
                netRevenue: totalRevenue, // Assuming 'completed' is net
                averageTicket: avgTicket,
                minTicket: minVal,
                maxTicket: maxVal
            },
            products: {
                byQuantity: topByQuantity,
                byRevenue: topByRevenue
            },
            locations: topLocations
        };
    }
}
