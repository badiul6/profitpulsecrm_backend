import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';


export type TemporaryPasswordDocument = HydratedDocument<TemporaryPassword>;


@Schema()
export class TemporaryPassword {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique:true})
  user: User;
  
  @Prop({required:true})
  temporaryPassword: string;

  @Prop({ type: Date, default: Date.now })
  temporaryPasswordCreatedAt: Date;
}

export const TemporaryPasswordSchema = SchemaFactory.createForClass(TemporaryPassword);
TemporaryPasswordSchema.index({ temporaryPasswordCreatedAt: 1 }, { expireAfterSeconds: 300 }); // TTL of 1 hour