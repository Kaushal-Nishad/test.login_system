import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import * as bodyParser from 'body-parser';
import { ConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter);
  app.setGlobalPrefix('api');

  const config = new ConfigService();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  }
  const configSwagger = new DocumentBuilder().setTitle('Test Project APIs').setDescription('API description').setVersion('1.0').addTag('cats').build();
  const document = SwaggerModule.createDocument(app, configSwagger, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(await config.getPortConfig());

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
