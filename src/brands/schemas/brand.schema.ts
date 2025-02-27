import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Brand extends Document {
  @Prop({ required: true, unique: true }) brandName: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
