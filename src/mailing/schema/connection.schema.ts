import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';

export type GmailDocument = HydratedDocument<Gmail>;

@Schema()
export class Gmail {
  @Prop({required:true})
  refresh_token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique:true})
  user: User;
  
}
export const GmailSchema = SchemaFactory.createForClass(Gmail);
