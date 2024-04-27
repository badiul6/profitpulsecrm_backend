import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({timestamps:true})
export class Sale {

    //customer
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact'})
    contact: Contact

    @Prop({ type: [{ _id:false,  name:String , quantity: Number, unit_price: Number, total_price: Number, discount:Number, net_price:Number }], default: []})
    products: { name: string, quantity: number, unit_price: number, total_price: number, discount: number, net_price: number }[];

    @Prop()
    sales_channel: string

    @Prop()
    payment_method: string

    @Prop()
    shipping_address: string

    @Prop()
    billing_address: string

    @Prop()
    location: string

    @Prop()
    shipping_cost: number

    @Prop()
    notes: string

    //assignedAgent
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true})
    user: User

}

export const SaleSchema = SchemaFactory.createForClass(Sale);
