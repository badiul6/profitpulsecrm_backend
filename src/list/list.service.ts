import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema';
import { List } from './schema';
import { ReqUser } from 'src/auth/dto';
import { GetDto, ListDto } from './dto';

@Injectable()
export class ListService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(List.name) private listModel: Model<List>){}

        async create(user: ReqUser, dto:ListDto){
            const userinDb= await this.userModel.findById(user.id).exec();
            try{
                await this.listModel.create(
                    {
                        name: dto.name,
                        mailing_list: dto.mailing_list,
                        company:userinDb.company,
                        creater: userinDb.fullname
                    }
                );
                return;    
            }
            catch(error){
                if (error.code === 11000) {
                    throw new ConflictException('Mailing list with this name already exists');
                } else {
                    console.log(error);
                }
            }
        }

        async get(user:ReqUser, getDto: GetDto){
            const userinDB= await this.userModel.findById(user.id).exec();
            const list= await this.listModel.findOne(
                {
                    name: getDto.name,
                    company: userinDB.company
                }
            ).select('name mailing_list -_id').exec();

            if(!list){
                throw new NotFoundException();
            }
            return list;
        }

        async getAll(user:ReqUser){
            const userinDB= await this.userModel.findById(user.id).exec();
            const lists= await this.listModel.find({
                company: userinDB.company
            }).select('name mailing_list creater updatedAt -_id').sort({updatedAt: -1}).exec()
            .catch(()=>{
                throw new NotFoundException()
            });
            
            return {
                data: lists
            }
        }

        async update(user:ReqUser, dto:ListDto){
            const userinDB= await this.userModel.findById(user.id).exec();
            const list= await this.listModel.findOneAndUpdate(
                {
                    name:dto.name,
                    company:userinDB.company
                },
                {
                    mailing_list:dto.mailing_list
                },
                {
                    new:true
                }
            ).select('name mailing_list creater -_id').exec()
            .catch(()=>{
                throw new NotFoundException();
            });

            if(!list){
                throw new NotFoundException();
            }
            return list;

        }
        
        async delete(user:ReqUser, dto:GetDto){
            const userinDB= await this.userModel.findById(user.id).exec();
            const list= await this.listModel.findOneAndDelete(
                {
                    name:dto.name,
                    company:userinDB.company
                }
            ).exec().catch(()=>{
                throw new NotFoundException();
            });
            if(!list){
                throw new NotFoundException();
            }
            return;
        }
}
