import { Controller, Get, Patch, Body, UseGuards, Request, Param, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('collectors')
  async getAllMembers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.membersService.getAllMembers(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMemberById(@Param('id') id: string) {
    return this.membersService.getMemberById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMember(@Param('id') id: string, @Body() updateData: Partial<any>) {
    return this.membersService.updateMember(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('delete/:userId')
  async softDeleteUser(@Param('userId') userId: string) {
    return this.membersService.softDeleteUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('promote/:userId')
  async promoteToAdmin(@Param('userId') userId: string) {
    return this.membersService.promoteToAdmin(userId);
  }
}
