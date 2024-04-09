import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Campaign } from './campaign.schema';
import { Contact } from 'src/contact/schema';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({timestamps:true})
export class Lead {

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required:true})
    contact: Contact

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required:true})
    campaign: Campaign

}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ contact: 1, campaign: 1 }, { unique: true });
