// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';
// import { User } from 'src/auth/schema';
// import { Contact } from 'src/contact/schema';

// export type DealDocument = HydratedDocument<Deal>;

// @Schema({timestamps:true})
// export class Deal {

//     @Prop({required:true})
//     status: string

//     @Prop({required:true})
//     interactions:string

//     @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required:true})
//     contact: Contact

//     @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true})
//     user: User

// }

// export const DealSchema = SchemaFactory.createForClass(Deal);
// // LeadSchema.index({ contact: 1, campaign: 1 }, { unique: true });
