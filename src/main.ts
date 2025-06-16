import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/config';
import * as passport from 'passport';
import * as cors from 'cors';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_KEY,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 30000,
      },
      genid: function (_req) {
        return uuid();
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(envs.port || 3000);
}
bootstrap();
