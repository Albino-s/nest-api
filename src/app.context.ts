import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

let context = null;
export const ApplicationContext = async () => {
    if (!context) {
        context = await NestFactory.create(ApplicationModule);
    }
    return context;
}
