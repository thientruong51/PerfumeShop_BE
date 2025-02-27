import { Controller, Get, Param, Patch, Body, UseGuards, Request  } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  /** 📌 Lấy danh sách tất cả thành viên (chỉ Admin) */
  @UseGuards(JwtAuthGuard)
  @Get('collectors')
  async getAllMembers(@Request() req) {
    return this.membersService.getAllMembers(req.user.sub);
  }

  /**  Lấy thông tin một thành viên theo ID */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMemberById(@Param('id') id: string) {
    return this.membersService.getMemberById(id);
  }

  /** Cập nhật thông tin cá nhân (chỉ chính user đó có quyền chỉnh sửa) */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMember(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.membersService.updateMember(id, updateData);
  }
  /**  Xóa mềm User (chỉ Admin mới xóa được) */
  @UseGuards(JwtAuthGuard)
  @Patch('delete/:userId')
  async softDeleteUser(@Request() req, @Param('userId') userId: string) {
    return this.membersService.softDeleteUser(req.user.sub, userId);
  }

  /**  Đổi role thành Admin (chỉ Admin mới có quyền) */
  @UseGuards(JwtAuthGuard)
  @Patch('promote/:userId')
  async promoteToAdmin(@Request() req, @Param('userId') userId: string) {
    return this.membersService.promoteToAdmin(req.user.sub, userId);
  }
}
