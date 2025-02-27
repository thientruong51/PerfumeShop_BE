import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  /**  Lấy danh sách tất cả thành viên (chỉ Admin được phép) */
  async getAllMembers(adminId: string) {
    const admin = await this.memberModel.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only admin can access this resource');
    }

    return await this.memberModel.find({}, '-password'); // Ẩn password khi trả về danh sách user
  }
  

 
  async getMemberById(id: string) {
    const member = await this.memberModel.findById(id);
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

 
  async updateMember(id: string, updateData: Partial<Member>) {
    return await this.memberModel.findByIdAndUpdate(id, updateData, { new: true });
  }

   /**  Xóa mềm user (chỉ admin mới được xóa) */
   async softDeleteUser(adminId: string, userId: string) {
    const admin = await this.memberModel.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only admin can delete users');
    }

    const user = await this.memberModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.isDeleted = true;
    await user.save();
    return { message: 'User deleted successfully (soft delete)' };
  }

  /**  Đổi role member thành Admin (chỉ admin mới có quyền) */
  async promoteToAdmin(adminId: string, userId: string) {
    const admin = await this.memberModel.findById(adminId);
    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only admin can promote users');
    }

    const user = await this.memberModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.isAdmin = true;
    await user.save();
    return { message: `User ${user.email} is now an admin` };
  }
}
