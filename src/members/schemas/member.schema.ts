import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string; 
  @Prop({ required: true }) name: string;
  @Prop() YOB: number;
  @Prop() gender: boolean;
  @Prop({ default: false }) isAdmin: boolean;
  @Prop({ default: false }) isDeleted: boolean; 
  @Prop() firebaseUid?: string; 
}

export const MemberSchema = SchemaFactory.createForClass(Member);
