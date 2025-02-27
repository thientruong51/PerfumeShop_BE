import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from '../../brands/schemas/brand.schema';
import { Member } from '../../members/schemas/member.schema';

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: Types.ObjectId, ref: 'Member', required: true }) author: Types.ObjectId;
    @Prop({ required: true, min: 1, max: 5 }) rating: number;
    @Prop({ required: true }) content: string;
  }
  
  export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Perfume extends Document {
  @Prop({ required: true }) perfumeName: string;
  @Prop({ required: true }) uri: string;
  @Prop({ required: true }) price: number;
  @Prop({ required: true }) concentration: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) ingredients: string;
  @Prop({ required: true }) volume: number;
  @Prop({ required: true }) targetAudience: string;
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true }) brand: Brand;
  @Prop({ type: [CommentSchema], default: [] }) comments: Comment[]; // 💬 Lưu đánh giá & bình luận
}

export const PerfumeSchema = SchemaFactory.createForClass(Perfume);
