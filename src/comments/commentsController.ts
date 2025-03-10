import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    Param, 
    Query, 
    UseGuards, 
    Request, 
    NotFoundException, 
    BadRequestException 
  } from '@nestjs/common';
  import { CommentsService } from './commentsService';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('comments')
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post()
    async addComment(
      @Request() req, 
      @Body('perfumeId') perfumeId: string, 
      @Body('rating') rating: number, 
      @Body('content') content: string
    ) {
      const memberId = req.user.userId; 
  
      if (!perfumeId || !rating || !content) {
        throw new BadRequestException('All fields are required');
      }
  
      return this.commentsService.addComment(memberId, perfumeId, rating, content);
    }
  
    @Get(':perfumeId')
    async getPerfumeComments(
      @Param('perfumeId') perfumeId: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 5
    ) {
      if (!perfumeId) {
        throw new NotFoundException('Perfume ID is required');
      }
  
      return this.commentsService.getPerfumeComments(perfumeId, page, limit);
    }
  }
  