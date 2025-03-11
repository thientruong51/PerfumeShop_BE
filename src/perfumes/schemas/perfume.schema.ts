import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from 'src/brands/schemas/brand.schema';

@Schema({ timestamps: true })
export class Perfume {
  @Prop({ required: true, index: true })
  perfumeName: string;

  @Prop({ required: true })
  uri: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  concentration: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  ingredients: string[];

  @Prop({ required: true })
  volume: number;

  @Prop({ required: true })
  targetAudience: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Brand' }) 
  brand: Types.ObjectId;
}

export type PerfumeDocument = Perfume & Document;
export const PerfumeSchema = SchemaFactory.createForClass(Perfume);
