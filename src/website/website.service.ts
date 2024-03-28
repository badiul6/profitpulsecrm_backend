import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Website } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReqUser } from 'src/auth/dto';
import { User } from 'src/auth/schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WebsiteService {
    constructor(@InjectModel(Website.name) private websiteModel: Model<Website>,
        @InjectModel(User.name) private userModel: Model<User>) { }

    async connectWebsite(user: ReqUser) {
        const userinDb = await this.userModel.findById(user.id);
        if (!userinDb) {
            throw new NotFoundException('User Not Found');
        }
        var isUnique: boolean = true;
        while (isUnique) {
            const code = uuidv4();
            try {
                const con= await this.websiteModel.create({
                    code: code,
                    company: userinDb.company
                });
                isUnique = false;
                return {
                    "code": con.code
                };
            } catch (error) {
                isUnique= false;
                if (error.code === 11000 && error.keyPattern.hasOwnProperty("company")) {
                    throw new ConflictException('Website already connected')
                }else if (error.code === 11000 && error.keyPattern.hasOwnProperty("code")) {
                    isUnique=true;
                }
            }
        }
    }

    async getConnection(user:ReqUser){
        const userinDb = await this.userModel.findById(user.id);
        if (!userinDb) {
            throw new NotFoundException('User Not Found');
        }
        const website = await this.websiteModel.findOne({ company: userinDb.company }).exec();
        return{
            "isConnected": website?true:false
        };
    }

    async disconnectWebsite(user:ReqUser){
        const userinDb = await this.userModel.findById(user.id);
        if (!userinDb) {
            throw new NotFoundException('User Not Found');
        }
        const website = await this.websiteModel.findOneAndDelete({ company: userinDb.company }).exec();
        if (website == null) {
            throw new NotFoundException('Connection Not Found');
        }
    }



}