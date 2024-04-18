  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { timeStamp } from 'console';
  import mongoose, { HydratedDocument } from 'mongoose';
  import { Company } from 'src/profile/schema';


  export type ContactDocument = HydratedDocument<Contact>;


  @Schema({timestamps:true})
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

    @Prop({required:true})
    creater: string;
    
  }
  export const ContactSchema = SchemaFactory.createForClass(Contact);
  ContactSchema.index({ email: 1, company: 1 }, { unique: true });
