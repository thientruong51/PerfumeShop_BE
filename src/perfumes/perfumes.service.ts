import { Injectable, NotFoundException, ForbiddenException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Perfume } from './schemas/perfume.schema';
import { Member } from '../members/schemas/member.schema';

@Injectable()
export class PerfumesService {
  constructor(@InjectModel(Perfume.name) private perfumeModel: Model<Perfume>,
  @InjectModel(Member.name) private memberModel: Model<Member>,)
   {}

  async createPerfume(data: any) {
    return await new this.perfumeModel(data).save();
  }

  async getAllPerfumes() {
    return await this.perfumeModel.find().populate('brand');
  }

  async getPerfumeById(id: string) {
    const perfume = await this.perfumeModel.findById(id).populate('brand');
    if (!perfume) throw new NotFoundException('Perfume not found');
    return perfume;
  }

  async updatePerfume(id: string, updateData: any) {
    return await this.perfumeModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deletePerfume(id: string) {
    return await this.perfumeModel.findByIdAndDelete(id);
  }
   /**  Thêm đánh giá & bình luận vào nước hoa */
  async addComment(userId: string, perfumeId: string, rating: number, content: string) {
    const perfume = await this.perfumeModel.findById(perfumeId);
    if (!perfume) throw new NotFoundException('Perfume not found');

    // Kiểm tra user đã đánh giá nước hoa này chưa
    const alreadyReviewed = perfume.comments.find((c) => c.author.toString() === userId);
    if (alreadyReviewed) {
      throw new ForbiddenException('You can only review a perfume once');
    }

    // Chuyển userId thành ObjectId
    const newComment = {
      author: new Types.ObjectId(userId), // ✅ Chuyển userId thành ObjectId
      rating,
      content,
    };

    perfume.comments.push(newComment);
    await perfume.save();

    return { message: 'Review added successfully' };
  }

  /**  Lấy danh sách đánh giá của một nước hoa */
  async getPerfumeComments(perfumeId: string) {
    const perfume = await this.perfumeModel.findById(perfumeId).populate('comments.author', 'name email');
    if (!perfume) throw new NotFoundException('Perfume not found');
    return perfume.comments;
  }
}
