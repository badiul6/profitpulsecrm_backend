import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type WebsiteDocument = HydratedDocument<Website>;

@Schema()
export class Website {

    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique:true})
    company: Company;

    @Prop({required:true, unique:true})
    code:string


}
export const WebsiteSchema = SchemaFactory.createForClass(Website);
