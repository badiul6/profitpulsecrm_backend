import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({timestamps:true})
export class Sale {

    //customer
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required:true})
    contact: Contact

    @Prop({ type: [{ _id:false,  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, unit_price: Number, total_price: Number, discount:Number, net_price:Number }], default: [], required:true})
    products: { productId: mongoose.Types.ObjectId, quantity: number, unit_price: number, total_price: number, discount: number, net_price: number }[];

    @Prop({required:true})
    sales_channel: string

    @Prop({required:true})
    payment_method: string

    @Prop({required:true})
    shipping_address: string

    @Prop({required:true})
    billing_address: string

    @Prop({required:true})
    location: string

    @Prop({required:true})
    shipping_cost: number

    @Prop({required:true})
    notes: string

    //assignedAgent
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true})
    user: User

}

export const SaleSchema = SchemaFactory.createForClass(Sale);
