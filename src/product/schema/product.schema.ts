import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({timestamps:true})
export class Product {

    @Prop({required:true})
    name:string

    @Prop()
    description:string

    @Prop({required:true})
    quantity:number

    @Prop({required:true})
    unit_price:number

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Company', required:true})
    company:Company

}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 1, company: 1 }, { unique: true });
