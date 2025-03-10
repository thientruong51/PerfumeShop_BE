import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>,
  ) {}

  async getAllMembers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.memberModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), 
      this.memberModel.countDocuments(),
    ]);
    return { data, total, page, limit };
  }
  

  async getMemberById(id: string) {
    const member = await this.memberModel.findById(id).lean();
    if (!member) throw new NotFoundException('User not found');
    return member;
  }

  async updateMember(id: string, updateData: Partial<any>) {
    const member = await this.memberModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!member) throw new NotFoundException('User not found');
    return member;
  }

  async softDeleteUser(userId: string) {
    const user = await this.memberModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.isDeleted = true;
    await user.save();

    return { message: 'User soft deleted successfully' };
  }

  async promoteToAdmin(userId: string,) {
    const user = await this.memberModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.isAdmin = true;
    await user.save();

    return { message: `${user.email} has been promoted to admin` };
  }
}
