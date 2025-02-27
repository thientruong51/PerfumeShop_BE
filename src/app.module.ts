import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { BrandsModule } from './brands/brands.module';
import { PerfumesModule } from './perfumes/perfumes.module';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule, 
    MembersModule,
    BrandsModule,
    PerfumesModule,
  ],
})
export class AppModule {}

