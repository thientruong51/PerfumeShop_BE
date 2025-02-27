import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]), // ✅ Đăng ký BrandSchema
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [MongooseModule], // ✅ Đảm bảo các module khác có thể sử dụng
})
export class BrandsModule {}
