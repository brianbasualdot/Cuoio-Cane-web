import { Injectable, Logger } from '@nestjs/common';
import { StaffService } from '../staff/staff.service';

// Service Imports (Dynamic or Direct)
// We need access to other services to perform actions.
// If these modules are not exported, we might need to refactor AppModule imports.
// For now, we assume we can import them or use dynamic references.
// Let's assume loose coupling via EventBus or direct Service injection if possible.
// Given strict "No reescribir app", we will try to use existing Services.

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(private readonly staffService: StaffService) { }

    // Since I don't have the full context of all services yet, I will create a switch-case structure
    // that logs extensively and tries to map standard actions.

    async processActions(actions: any[]) {
        this.logger.log(`Received ${actions.length} offline actions to sync.`);

        const results = [];
        const succeededIds: string[] = [];
        const failedDetails: any[] = [];

        // Sort by timestamp to preserve order
        const sortedActions = actions.sort((a, b) => a.timestamp - b.timestamp);

        for (const action of sortedActions) {
            this.logger.log(`Processing [${action.entidad} - ${action.accion}] ID: ${action.id}`);

            try {
                await this.applyAction(action);

                results.push({ id: action.id, status: 'synced', timestamp: new Date().toISOString() });
                succeededIds.push(action.id);
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                this.logger.error(`Failed action ${action.id}: ${errorMessage}`);

                results.push({ id: action.id, status: 'failed', reason: errorMessage });
                failedDetails.push({ id: action.id, reason: errorMessage });
            }
        }

        return {
            status: 'success',
            synced: succeededIds,
            failed: failedDetails,
            server_timestamp: new Date().toISOString()
        };
    }

    private async applyAction(action: any) {
        // { operario_id, entidad, accion, payload }
        // We act on behalf of operario_id.

        switch (action.entidad) {
            case 'staff':
                await this.handleStaffAction(action);
                break;
            // Add other entities: 'products', 'orders', etc.
            default:
                throw new Error(`Unknown entity: ${action.entidad}`);
        }
    }

    private async handleStaffAction(action: any) {
        const p = action.payload;
        if (action.accion === 'create') {
            await this.staffService.createStaff(p.alias, p.code);
        } else if (action.accion === 'update') {
            // We need to know WHAT update. For now 'updateStatus' is main one.
            // Payload from frontend: { id, isActive }
            if (p.id && typeof p.isActive === 'boolean') {
                await this.staffService.updateStaffStatus(p.id, p.isActive);
            } else {
                throw new Error('Invalid payload for update staff');
            }
        } else if (action.accion === 'delete') {
            if (p.id) {
                await this.staffService.deleteStaff(p.id);
            } else {
                throw new Error('Invalid payload for delete staff');
            }
        } else {
            throw new Error(`Unknown staff action: ${action.accion}`);
        }
    }
}
