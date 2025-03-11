import * as passport from 'passport';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: "http://localhost:5173", 
    credentials: true, 
  });

 
  app.use(
    session({
      secret: 'a6$2d!k9@1x#f8m0o2p7v4c3t9r5b6q1',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, 
    }),
  );

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  
  app.use((req, res, next) => {
    if (req.url === '/favicon.ico') {
      return res.status(204).end(); 
    }
    next();
  });

 
  app.use(passport.initialize());
  app.use(passport.session());

 
  app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

 
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
