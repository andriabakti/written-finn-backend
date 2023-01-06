import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import compression from 'compression';
import helmet from 'helmet';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const port = process.env.PORT || 3939;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('/api/v1');
  await app.listen(port);
}
bootstrap();
