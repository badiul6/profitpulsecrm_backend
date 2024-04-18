import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type ListDocument = HydratedDocument<List>;

@Schema({timestamps:true})
export class List {

    @Prop({required:true})
    name:string

    @Prop({type:[String], required:true})
    mailing_list:string[]

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Company', required:true})
    company:Company

    @Prop()
    creater:string

}

export const ListSchema = SchemaFactory.createForClass(List);
ListSchema.index({ name: 1, company: 1 }, { unique: true });
