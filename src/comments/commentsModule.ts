import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsService } from './commentsService';
import { CommentsController } from './commentsController'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService], 
})
export class CommentsModule {}
