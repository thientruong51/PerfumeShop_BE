import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfumesService } from './perfumes.service';
import { PerfumesController } from './perfumes.controller';
import { Perfume, PerfumeSchema } from './schemas/perfume.schema';
import { Brand, BrandSchema } from '../brands/schemas/brand.schema';
import { MembersModule } from '../members/members.module';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Perfume.name, schema: PerfumeSchema }]),
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    MembersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }), 
  ],
  controllers: [PerfumesController],
  providers: [PerfumesService],
  exports: [MongooseModule, PerfumesService], 
})
export class PerfumesModule {}
