import { Body, Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Post()
    async sync(@Body() body: { operario_id: string; events: any[] }) {
        // We pass the events to the service. We might want to pass operario_id too for context/logging.
        return this.syncService.processActions(body.events);
    }
}
