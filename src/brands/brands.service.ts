import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand } from './schemas/brand.schema';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<Brand>,
  ) {}

  async createBrand(createData: any) {
    return this.brandModel.create(createData);
  }

  async getAllBrands() {
    return this.brandModel.find().sort({ createdAt: -1 }).lean();
  }
  

  async getBrandById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Brand ID');
    }
    const brand = await this.brandModel.findById(id).lean();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async getBrandByName(brandName: string): Promise<Brand | null> {
    return this.brandModel.findOne({ brandName }).exec();
  }

  async updateBrand(id: string, updateData: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Brand ID');
    }
    const brand = await this.brandModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }
  
  async deleteBrand(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid Brand ID');
    }
    const result = await this.brandModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Brand not found');
    return { message: 'Brand deleted successfully' };
  }
  
}
