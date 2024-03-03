import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/profile/schema';

export enum Role {
    OWNER = 'OWNER',
    MAGENT = 'MAGENT',
    SHEAD = 'SHEAD',
    SAGENT = 'SAGENT',
    CSAGENT = 'CSAGENT',
  }
export type UserDocument = HydratedDocument<User>;


@Schema()
export class User {
  @Prop({required:true, unique: true})
  email: string;

  @Prop()
  fullname: string;

  @Prop({required: true})
  password: string;
  

  @Prop({ type: [String], enum: Object.values(Role), required:true })
  roles: Role[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company'})
  company: Company;
}

export const UserSchema = SchemaFactory.createForClass(User);