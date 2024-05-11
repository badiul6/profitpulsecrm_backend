import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get<ConfigService>(ConfigService);
  const sessionService = app.get<AuthService>(AuthService);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    );
    res.header({
      'Access-Control-Allow-Origin': configService.get('FRONTEND_WEB_URL'),
    });
    next();
  });
  app.use(
    session({
      secret: configService.get('SECRET_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
      store: sessionService.sessionStore(),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ProfitPulse API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, document);

  app.use(passport.initialize());
  app.use(passport.session());
  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie'],
  });

  // Additional headers
  app.use((req, res, next) => {
    res.header({
      'Content-Type': 'application/json',
      Authorization: 'Authorization',
      'Access-Control-Expose-Headers': 'x-total-count',
    });
    next();
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3333);
}
bootstrap();
