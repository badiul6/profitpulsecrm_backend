import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { CompanyDto, UpdatePasswordDto, UpdateUserDto, UserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Company } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from 'src/auth/schema';
import * as argon from 'argon2';

@Injectable()
export class ProfileService {
    constructor(private config: ConfigService,
        @InjectModel(Company.name) private companyModel: Model<Company>,
        @InjectModel(User.name) private userModel: Model<User>) { }

    async createCompany(user: ReqUser, companydto: CompanyDto) {
        //check if company already exists
        const userinDb= await this.userModel.findById(user.id).exec();
        if(userinDb.company){
            throw new ConflictException('Company already exist');
        }
        //converts image to base64 format
        const logoStr = companydto.logo.buffer.toString('base64');

        const companyData = {
            email: companydto.email,
            name: companydto.name,
            contact: companydto.contact,
            website_link: companydto.website_link,
            logo: logoStr,
            social_link: companydto.social_link,
            address: companydto.address
        };
        //create company record
        try {

            const company = new this.companyModel(companyData);
            await company.save();

            //establish relation by updating the user(OWNER)
            userinDb.company= company.id
            await userinDb.save();
            
            return;
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                throw new ConflictException('Email already in use');
            } else {
                throw error;
            }
        }
    }

    async addUsers(user: ReqUser, userdto: UserDto) {
        //get owner for companyID
        const owner = await this.userModel.findById(user.id).exec();
        if(owner.company===undefined){
            throw new NotFoundException('Company Not Found');
        }
        //set roles
        let role: Array<Role> = [];
        role.push(userdto.role);
        if (userdto.role == Role.SHEAD) {
            role.push(Role.SAGENT);
        }
        const hash= await argon.hash(this.config.get('USER_PASSWORD'));
        const userData = {
            fullname: userdto.fullname,
            email: userdto.email,
            password: hash,
            roles: role,
            company: owner.company
        };
        try {
            //create new user
            const newUser = new this.userModel(userData);
            await newUser.save();
            return;

        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                throw new ConflictException('Email already in use');
            } else {
                throw error;
            }
        }
    }

    async updateUser(user: ReqUser, userdto: UpdateUserDto) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(user.id, userdto,
                { new: true }).exec();
            if (!updatedUser) {
                throw new NotFoundException();
            }
        } catch (error) {
            throw error;
        }

    }

    async updatePassword(user: ReqUser, updatePassword: UpdatePasswordDto) {
        const userInDB = await this.userModel.findById(user.id).exec();
        const isCorrect = await argon.verify(userInDB.password, updatePassword.old_password);
        if (!isCorrect) {
            throw new UnauthorizedException('Old Password is incorrect');
        }
        const hash = await argon.hash(updatePassword.new_password);
        await this.userModel.findByIdAndUpdate(user.id, {
            password: hash
        }, { new: true }).exec();
    }

    async viewUsers(user: ReqUser) {
        try {
            //finds the owner to get companyID
            const owner = await this.userModel.findById(user.id).exec();
            //finds all users of company other than owner
            const users = await this.userModel.find({
                company: owner.company,
                roles: { $ne: Role.OWNER } // $ne stands for "not equal"
            },
                {
                    _id: 0,
                    email: 1,
                    fullname: 1,
                    roles: 1,
                }).exec();

            return users;
        }
        catch (error) {
            throw new Error(`Error finding users: ${error.message}`);
        }
    }
    async deleteuser(email:string, user: ReqUser){
        try{
            const owner= await this.userModel.findById(user.id).exec();
            const res=await this.userModel.findOneAndDelete({email, company: owner.company}).exec();
        
            if(res==null){
                throw new NotFoundException('User Not Found');
            }
        }
        catch(error){
            throw new NotFoundException("User Not Found");
        }
    }
}
