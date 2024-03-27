import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';

export type TemplateDocument = HydratedDocument<Template>;


@Schema({timestamps:true})
export class Template {
  
    @Prop({required:true})
    name:string

    @Prop({required:true})
    body:string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    user: User;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.index({ name: 1, user: 1 }, { unique: true });
