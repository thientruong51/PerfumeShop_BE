import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Perfume', required: true })
  perfume: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 3 })
  rating: number;

  @Prop({ required: true })
  content: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ author: 1, perfume: 1 });