import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type FacebookDocument = HydratedDocument<Facebook>;

@Schema()
export class Facebook {
  @Prop({required:true})
  access_token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique:true})
  company: Company;
  
}
export const FacebookSchema = SchemaFactory.createForClass(Facebook);
