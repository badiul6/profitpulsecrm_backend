import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';

export type CompanyDocument = HydratedDocument<Company>;


@Schema()
export class Company {
  @Prop({required:true, unique: true})
  email: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true})    
  contact: string;

  @Prop({required: true})
  website_link: string;

  @Prop()
  address: string;

  @Prop()
  logo: string;

  @Prop()
  social_link: string;

}

export const CompanySchema = SchemaFactory.createForClass(Company);