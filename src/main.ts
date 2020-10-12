import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // init global validation for dto
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }),
  );
  // init global serialization for entity transformations
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );

  await app.listen(3000);
}
bootstrap();
