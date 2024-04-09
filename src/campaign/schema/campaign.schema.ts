import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({timestamps:true})
export class Campaign {

    @Prop({required:true})
    name:string

    @Prop({required:true})
    totalEmailsSent:number

    // @Prop({required:true})
    // impression:number

    @Prop({required:true})
    clicks:number

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Company', required:true})
    company:Company

}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
CampaignSchema.index({ name: 1, company: 1 }, { unique: true });
