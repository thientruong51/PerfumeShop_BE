import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Perfume, PerfumeDocument } from './schemas/perfume.schema';
import { Comment, CommentDocument } from 'src/comments/schemas/comment.schema';
import { Brand, BrandDocument } from 'src/brands/schemas/brand.schema';

@Injectable()
export class PerfumesService {
  constructor(
    @InjectModel(Perfume.name)
    private perfumeModel: Model<PerfumeDocument>,
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  
  async createPerfume(createData: any) {
    const brandExists = await this.brandModel.findOne({ brandName: createData.brand }).lean();
    if (!brandExists) throw new NotFoundException('Brand not found');

    return this.perfumeModel.create({
      ...createData,
      brand: createData.brand, 
    });
  }

  
  async getAllPerfumes(
    page = 1,
    limit = 10,
  ) {
    const query: Record<string, any> = {};
    const skip = (page - 1) * limit;
    const [perfumes, total] = await Promise.all([
      this.perfumeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(), 
      this.perfumeModel.countDocuments(query),
    ]);
  
    return {
      data: perfumes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  
  async getAllPerfumesBySearch(perfumeName: string, brand: string, page = 1, limit = 8) {
    const query: Record<string, any> = {};
  
    if (perfumeName) {
      query.perfumeName = { $regex: new RegExp(perfumeName, "i") };
    }
  
    if (brand) {
      query.brand = brand; 
    }
  
    console.log("📌 Query MongoDB:", query);
  
    const skip = (page - 1) * limit;
  
    const [perfumes, total] = await Promise.all([
      this.perfumeModel.find(query).skip(skip).limit(limit).exec(),
      this.perfumeModel.countDocuments(query),
    ]);
  
    console.log("🔍 Perfumes tìm được:", perfumes);
    console.log("📢 Tổng số perfumes:", total);
  
    return {
      data: perfumes,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  
  
  
  async getAllPerfumesNotPage() {
    const query: Record<string, any> = {};
    const perfumes = await this.perfumeModel.find(query).sort({ createdAt: -1 }).exec();
    return { data: perfumes };
  }
  
  
  async getAllBrands() {
    const brands = await this.perfumeModel.distinct('brand'); 
    return brands;
  }
  
  
  async getPerfumeById(id: string) {
    const perfume = await this.perfumeModel.findById(id).lean();
    if (!perfume) throw new NotFoundException('Perfume not found');
    return perfume;
  }

 
  async updatePerfume(id: string, updateData: any) {
    if (updateData.brand) {
      const brandExists = await this.brandModel.findOne({ brandName: updateData.brand }).lean();
      if (!brandExists) throw new NotFoundException('Brand not found');
    }

    const perfume = await this.perfumeModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!perfume) throw new NotFoundException('Perfume not found');
    return perfume;
  }

  
  async deletePerfume(id: string) {
    const result = await this.perfumeModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Perfume not found');
    return { message: 'Perfume deleted successfully' };
  }

}
