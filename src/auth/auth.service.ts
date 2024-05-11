import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AuthDto, ForgotPasswordDto, ReqUser } from './dto';
import * as argon from 'argon2';
import { Role, TemporaryPassword, User } from './schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
const MongoStore= require('connect-mongo');
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(TemporaryPassword.name) private temppassModel: Model<TemporaryPassword>,
        @InjectConnection() private connection: Connection,
        private mailerService: MailerService,
        private configService: ConfigService
    ){}

    async signup(dto: AuthDto) {
        var isUnique: boolean = true;
        while (isUnique) {
            const code = uuidv4();
            try {
                const hash = await argon.hash(dto.password);
                dto.password= hash;
                dto['verificationlink']= code;
                dto['isVerified']= false;
                const user= new this.userModel(dto);
                await user.save();
                isUnique = false;
                const backend_url= this.configService.get('BACKEND_SERVER_URL')
                await this.mailerService.sendMail({
                    to:dto.email,
                    from: `ProfitPulse CRM<${this.configService.get('GMAIL_USER')}>`,
                    subject: 'ProfitPulse CRM - Email Verification',
                   template: 'verification',
                   context:{
                    fullname: dto.fullname,
                    url: `${backend_url}/auth/verify/${user.verificationlink}`
                   }
                });

                return{
                    message: "User created successfully",
                    fullname: user.fullname,
                    email: user.email
                };
            }
            catch (error) {
                isUnique= false;
                if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                    throw new ConflictException('Email already in use');
                } else if(error.code === 11000 && error.keyPattern && error.keyPattern.verificationlink) {
                    isUnique=true;
                }
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
            const temppass= await this.temppassModel.findOne({user:user.id}).exec();
            if(!temppass){
                throw new ForbiddenException("Password doesn't match");
            }
            const isTempCorrect= await argon.verify(temppass.temporaryPassword, password);
            if(!isTempCorrect){
                throw new ForbiddenException("Password doesn't match");
            }
        }
        return {
            id: user.id,
            roles: user.roles
        }
    }
    async checkUser(user: ReqUser){
        return await this.userModel.findById(user.id).exec();
    }
    sessionStore(){
        return MongoStore.create({
            client: this.connection.getClient(),
            touchAfter: 24 * 3600 // time period in seconds
        })
    }
    async signin(user: ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        var complete= true;
        if(userinDb.company=== undefined){
            complete= false;
        }
        if(userinDb.isVerified==false){
            throw new UnprocessableEntityException('User not verified');
        }
        return {
            message: 'User logged in',
            isCompleted: complete,
            roles: user.roles,
        };
    }
    signout(user:any){
        user.session.destroy();
        return { msg: 'The user session has ended' }
    }

    async verify(code:string){
        const user= await this.userModel.findOneAndUpdate(
            { verificationlink:code },
            { isVerified:true },
            {new:true}
        ).exec();
        const frontend_url= this.configService.get('FRONTEND_WEB_URL')
        if(!user){
            return {url:`${frontend_url}/verify-account/failure`};
        }
        return {url:`${frontend_url}/verify-account/success`}
    }

    async forgotPassword(dto:ForgotPasswordDto){
        const user= await this.userModel.findOne({email:dto.email});
        if(!user){
            throw new NotFoundException('No user exists with this email');
        }
        if(!user.roles.includes(Role.OWNER)){
            throw new NotFoundException('Contact your company owner for password reset');
        }
        const code = uuidv4();
        const hash = await argon.hash(code);
        const frontend_url= this.configService.get('FRONTEND_WEB_URL');
        const url= frontend_url+'/signin';
        await this.temppassModel.create({
            user: user.id,
            temporaryPassword:hash,
        }).then(async temp =>{
            await this.mailerService.sendMail({
                to:user.email,
                from: `ProfitPulse CRM<${this.configService.get('GMAIL_USER')}>`,
                subject: 'ProfitPulse CRM - Password Reset Request',
               template: 'forgotpassword',
               context:{
                name: user.fullname,
                password: code,
                url: url
               }
            });
        })
        .catch(error =>{
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException('Wait for 5 minutes to request another password reset');
            }
        });


    }
}
