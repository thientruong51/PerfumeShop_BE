import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>
  ) {}

 
  async addComment(memberId: string, perfumeId: string, rating: number, content: string) {
    if (rating < 1 || rating > 3) {
      throw new BadRequestException('Rating must be between 1 and 3');
    }

    const existingComment = await this.commentModel.findOne({ author: memberId, perfume: perfumeId });
    if (existingComment) {
      throw new BadRequestException('You have already reviewed this perfume');
    }

    
    const comment = await this.commentModel.create({
      author: memberId,
      perfume: perfumeId,
      rating,
      content,
    });

    return { message: 'Comment added successfully', data: comment };
  }

 
  async getPerfumeComments(perfumeId: string, page: number, limit: number) {
    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ perfume: perfumeId })
        .populate('author', 'fullName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
  
      this.commentModel.countDocuments({ perfume: perfumeId }),
    ]);
  
    return { data: comments, total };
  }
  async findCommentsByPerfume(perfumeId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ perfume: perfumeId })  
      .populate('author', 'fullName')  
      .exec();
  }
  
}
