import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User } from './schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
const MongoStore= require('connect-mongo');


@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,@InjectConnection() private connection: Connection){ }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password);
            dto.password= hash;
            const user= new this.userModel(dto);
            await user.save();

            return{
                message: "User created successfully",
                fullname: user.fullname,
                email: user.email
            };
        }
        catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                throw new ConflictException('Email already in use');
            } else {
                throw error;
            }
        }
    }
    async validateuser(email: string, password: string){
        const user= await this.userModel.findOne({
            email: email
        }).exec();
        if(!user){
            return null;
        }
        const isCorrect= await argon.verify(user.password, password);

        if(!isCorrect){
            throw new ForbiddenException("Password doesn't match");
        }
        return {
            id: user.id,
            roles: user.roles
            
        }
    }
    sessionStore(){
        return MongoStore.create({
            client: this.connection.getClient(),
            touchAfter: 24 * 3600 // time period in seconds
        })
    }
    signin(){
        return {
            message: 'User logged in'
        };
    }
    signout(user:any){
        user.session.destroy();
        return { msg: 'The user session has ended' }
    }
}
