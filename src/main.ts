import {BaseExceptionFilter, NestFactory, HttpAdapterHost} from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ConfigService } from 'nestjs-config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import {AllExceptionsFilter} from './filters/exception.filter';
import {LoggerService} from 'nest-logger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const options = new DocumentBuilder()
      .setTitle('Nest API')
      .setDescription('This API is based on REST and use JWT as authorization protocol')
      .setVersion('0.01')
      .addBearerAuth()
      .build();
  app.use(cors());
  app.useLogger(app.get(LoggerService));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(ConfigService.get('app.port'));
}
bootstrap();
