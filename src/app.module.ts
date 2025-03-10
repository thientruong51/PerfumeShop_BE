import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { BrandsModule } from './brands/brands.module';
import { PerfumesModule } from './perfumes/perfumes.module';

import { PagesModule } from './pages/pages.module';
dotenv.config();

@Module({
  imports: [
    PagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule, 
    MembersModule,
    BrandsModule,
    PerfumesModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
