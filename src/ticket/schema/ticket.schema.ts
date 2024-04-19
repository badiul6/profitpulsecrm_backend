import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';


export enum TicketStatus {
    CREATED = 'CREATED',
    FORWARDED = 'FORWARDED',
    RESOLVED = 'RESOLVED',
  }
export type TicketDocument = HydratedDocument<Ticket>;

@Schema({timestamps:true})
export class Ticket { 
    @Prop({required:true})
    status: TicketStatus

    @Prop({required:true})
    issue:string

    @Prop({type: [String]})
    progress:string[]

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true})
    user:User

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required:true})
    contact:Contact

    @Prop({ unique: true, required:true})
    ticketNo: string;
}
export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.pre<TicketDocument>('save', async function (next) {
    // Generate a unique ticket number
    const currentDate = new Date();
    const ticketNo = `TICKET-${currentDate.getTime()}-${Math.floor(Math.random() * 1000)}`;
    
    // Check if the generated ticket number already exists
    const existingTicket = await this.model('Ticket').findOne({ ticketNo });
    if (existingTicket) {
      // If the generated ticket number already exists, regenerate it
      return next(new Error('Ticket number already exists. Please try again.'));
    }
    
    // Set the generated ticket number
    this.ticketNo = ticketNo;
  
    next();
  });
