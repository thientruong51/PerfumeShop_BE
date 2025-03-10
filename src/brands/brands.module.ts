import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]), 
    AuthModule,
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [MongooseModule,BrandsService], 
  
})
export class BrandsModule {}
