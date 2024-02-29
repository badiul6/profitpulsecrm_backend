
import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { ReqUser } from "../dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schema";
import { Model } from "mongoose";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@InjectModel(User.name) private userModel: Model<User> ){
    super();
}
serializeUser(user: ReqUser, done: (err: any, user: ReqUser)=> void) {
    done(null, user);
}
async deserializeUser(user: ReqUser, done: (err: any, user: ReqUser)=> void) {
    const userinDb= await this.userModel.findById(user.id).exec();

    return userinDb ? done(null, user) : done(null, null);

}
}