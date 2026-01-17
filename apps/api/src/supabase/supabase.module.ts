import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
    providers: [
        {
            provide: 'SUPABASE_CLIENT',
            useFactory: (configService: ConfigService) => {
                // Backend API should use Service Role Key for Admin privileges (User management etc.)
                // Fallback to SUPABASE_KEY if SERVICE_ROLE is missing (but functionality will limit)
                const key = configService.get('SUPABASE_SERVICE_ROLE_KEY') || configService.getOrThrow('SUPABASE_KEY');
                return createClient(
                    configService.getOrThrow('SUPABASE_URL'),
                    key,
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule { }
