import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './schemas/brand.schema';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async createBrand(brandName: string) {
    return await new this.brandModel({ brandName }).save();
  }

  async getAllBrands() {
    return await this.brandModel.find();
  }

  async updateBrand(id: string, brandName: string) {
    const brand = await this.brandModel.findByIdAndUpdate(id, { brandName }, { new: true });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async deleteBrand(id: string) {
    return await this.brandModel.findByIdAndDelete(id);
  }
}
