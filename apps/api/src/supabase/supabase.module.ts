import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
    providers: [
        {
            provide: 'SUPABASE_CLIENT',
            useFactory: (configService: ConfigService) => {
                return createClient(
                    configService.getOrThrow('SUPABASE_URL'),
                    configService.getOrThrow('SUPABASE_KEY'),
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule { }
