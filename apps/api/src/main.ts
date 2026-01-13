import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001', /\.cuoiocane\.com$/],
        credentials: true,
    });
    await app.listen(3002);
}
bootstrap();
