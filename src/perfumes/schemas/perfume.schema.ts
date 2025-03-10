import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Perfume extends Document {
  @Prop({ required: true })
  perfumeName: string;

  @Prop({ required: true })
  uri: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  concentration: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ingredients: string;

  @Prop({ required: true })
  volume: number;

  @Prop({ required: true })
  targetAudience: string;

  @Prop({ required: true, ref: 'Brand' })
  brand: string; 
}

export type PerfumeDocument = Perfume & Document;
export const PerfumeSchema = SchemaFactory.createForClass(Perfume);
