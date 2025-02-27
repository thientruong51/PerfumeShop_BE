import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request  } from '@nestjs/common';
import { PerfumesService } from './perfumes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('perfumes')
export class PerfumesController {
  constructor(private readonly perfumesService: PerfumesService) {}

  @Post() async createPerfume(@Body() data: any) {
    return this.perfumesService.createPerfume(data);
  }

  @Get() async getAllPerfumes() {
    return this.perfumesService.getAllPerfumes();
  }

  @Get(':id') async getPerfumeById(@Param('id') id: string) {
    return this.perfumesService.getPerfumeById(id);
  }

  @Patch(':id') async updatePerfume(@Param('id') id: string, @Body() data: any) {
    return this.perfumesService.updatePerfume(id, data);
  }

  @Delete(':id') async deletePerfume(@Param('id') id: string) {
    return this.perfumesService.deletePerfume(id);
  }
  /** 📌 Đánh giá & bình luận một nước hoa */
  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async addComment(
    @Request() req,
    @Param('id') perfumeId: string,
    @Body('rating') rating: number,
    @Body('content') content: string,
  ) {
    return this.perfumesService.addComment(req.user.sub, perfumeId, rating, content);
  }

  /** 📌 Lấy danh sách đánh giá của nước hoa */
  @Get(':id/comments')
  async getPerfumeComments(@Param('id') perfumeId: string) {
    return this.perfumesService.getPerfumeComments(perfumeId);
  }
}
