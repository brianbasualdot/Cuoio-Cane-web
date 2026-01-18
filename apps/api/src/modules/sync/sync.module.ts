import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { StaffModule } from '../staff/staff.module';

@Module({
    imports: [StaffModule],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule { }
