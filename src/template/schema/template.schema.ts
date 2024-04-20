import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type TemplateDocument = HydratedDocument<Template>;

export interface Data {
    assets: any[];
    styles: any[];
    pages: { component: string }[];
}

@Schema({timestamps:true})
export class Template {
  
    @Prop({required:true})
    name:string

    @Prop({type: mongoose.Schema.Types.Mixed, required:true})
    data: Data

    @Prop({required:true})
    thumbnail:string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true})
    company: Company;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.index({ name: 1, company: 1 }, { unique: true });
