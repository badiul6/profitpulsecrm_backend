
import { Injectable     } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { ReqUser } from "../dto";

@Injectable()
export class SessionSerializer extends PassportSerializer {

serializeUser(user: ReqUser, done: (err: any, user: ReqUser)=> void) {
    done(null, user);
}
async deserializeUser(user: ReqUser,done: (err: any, user: ReqUser)=> void) {
    return done(null, user);
}
}