import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';


export type ContactDocument = HydratedDocument<Contact>;


@Schema()
export class Contact {
  @Prop({required:true})
  email: string;

  @Prop({required: true})
  fullname: string;

  @Prop({required: true})
  phone: string;

  @Prop()
  companyname: string;

  
  @Prop()
  jobtitle: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true})
  company: Company;
  
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.index({ email: 1, company: 1 }, { unique: true });
