import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import configuration from './config/configuration';
import AppValidationError from './shared/utils/AppValidationError';

const config = configuration();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const constraints = validationErrors[0]?.constraints || null;
        let message = null;
        if (typeof constraints == 'object') {
          const message_key = Object.keys(validationErrors[0].constraints)[0];
          message = validationErrors[0].constraints[message_key];
        }
        return new AppValidationError(message || 'Validation Error Occured');
      },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, token',
  });

  const configuration = new DocumentBuilder()
    .setTitle('AIR QUALITY')
    .setDescription('REST API for air quality information of nearest city to GPS coordinates')
    .setVersion('1.0')
    .addTag('AIR QUALITY')
    .build();

  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup('/swagger', app, document);

  app.use(compression());
  app.use(helmet());

  await app.listen(config.app.port, () => {
    console.warn(`server listening on port ${config.app.port}`);
  });
}
bootstrap();
