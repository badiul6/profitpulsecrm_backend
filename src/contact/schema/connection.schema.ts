import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schema';

export type ConnectionDocument = HydratedDocument<Connection>;

@Schema()
export class Connection {
  @Prop({required:true})
  refresh_token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique:true})
  user: User;
  
}
export const ConnectionSchema = SchemaFactory.createForClass(Connection);
