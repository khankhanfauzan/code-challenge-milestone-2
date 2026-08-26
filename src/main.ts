import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestJs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.useGlobalFilters(new AllExceptionsFilter)

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Simple Q&A Forum API')
    .setDescription('REST API for a Q&A forum: user auth and thread CRUD with ownership checks.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`)
}
bootstrap();
