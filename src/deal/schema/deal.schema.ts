import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';

export enum Status {
    CREATED = 'CREATED',
    INPROGRESS = 'INPROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED= 'CANCELLED'
  }
export type DealDocument = HydratedDocument<Deal>;

@Schema({timestamps:true})
export class Deal {

    @Prop({required:true})
    status: Status

    @Prop({type: [String]})
    interactions:string[]
    
    //customer
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required:true})
    contact: Contact

    //assignedAgent
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true})
    user: User
    // Add a new computed field that is true if status is CREATED or INPROGRESS
    @Prop({ type: Boolean, default: function() {
      return [Status.CREATED, Status.INPROGRESS].includes(this.status);
    }})
    isActive: boolean;
}

export const DealSchema = SchemaFactory.createForClass(Deal);
DealSchema.index(
  { contact: 1, user: 1, isActive: 1 },
  {
      unique: true,
      partialFilterExpression: { isActive: true }
  }
);
