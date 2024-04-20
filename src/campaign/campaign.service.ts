import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { CampaignDto, ClickDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign, Lead } from './schema';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';

@Injectable()
export class CampaignService {
    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Lead.name) private leadModel: Model<Lead>,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
    ){}
   async create(user:ReqUser, campaignDto: CampaignDto){
        const userinDb= await this.userModel.findById(user.id).exec();
        if(!userinDb){
            throw new NotFoundException('User Not Found');
        }
        try{
            await this.campaignModel.create({
                name: campaignDto.name,
                // impression:0,
                clicks:0,
                totalEmailsSent:0,
                company: userinDb.company
            });
            return{
                message: "Campaign created successfully"
            };

        }catch(error){
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException('Campaign already exists with the same name');
            }
            console.log(error);
        }
    }

    async trackClick(clickDto:ClickDto){
        const campaign= await this.campaignModel.findById(clickDto.campaign)
        .catch(error => {
                console.error('Error incrementing click count:', error);
            });
        if(!campaign){
        return { url: `https://${clickDto.url}` };
        }
        
        const contact= await this.contactModel.findOne({email:clickDto.email, company:campaign.company})
        .catch(error => {
            console.error('Error incrementing click count:', error);
        });
        if(!contact){
            return { url: `https://${clickDto.url}` };
        }
        //lead
        await this.leadModel.create({
            contact:contact.id,
            campaign:campaign.id,
            
        }).then(async lead=>{
           campaign.clicks++;
           await campaign.save();
        }).catch(error=>{
            console.log('fail'+ error);
        });
        return { url: `https://${clickDto.url}` };
    }

    async getCampaign(campaignDto:CampaignDto, user:ReqUser){
        const userinDB= await this.userModel.findById(user.id).exec();
        const campaign= await this.campaignModel.findOne(
            {
                name: campaignDto.name,
                company:userinDB.company
            },
            {
                _id:0,
                name:1,
                totalEmailsSent:1,
                impression: 1,
                clicks:1,
            }

        ).exec();
        
        if(!campaign){
            throw new NotFoundException('No Campaign found with this name');
        }
        return {
            campaign: campaign
        };
    }

    async getAllCampaign(user:ReqUser){
        const userinDB= await this.userModel.findById(user.id).exec();
        const campaigns= await this.campaignModel.find(
            {
                company:userinDB.company
            },
            {
                _id:0,
                name:1,
                totalEmailsSent:1,
                clicks:1,
            }

        ).exec().catch(()=>{throw new NotFoundException()});
        
        return {
            campaigns: campaigns
        }
    }

    async getAllLeads(campaignDto: CampaignDto, user: ReqUser){
        const userinDB= await this.userModel.findById(user.id);

        const campaign= await this.campaignModel.findOne({name:campaignDto.name, company: userinDB.company});
        if(!campaign){
            throw new NotFoundException('Campaign not found with this name');
        }
        const leads = await this.leadModel.find({ campaign: campaign.id })
            .populate({
                path: 'contact',
                select: 'fullname email phone companyname jobtitle -_id'
            })
            .select('-_id createdAt')
            .sort({ createdAt: -1 })
            .exec().catch(()=>{throw new NotFoundException()});
            return {
                data: leads
            };
    }

    async deleteCampaign(user: ReqUser, dto: CampaignDto){
        const userinDB=  await this.userModel.findById(user.id).exec();
        const campaign= await this.campaignModel.findOne(
            {
                name: dto.name,
                company: userinDB.company
            }
        ).exec().catch(()=>{throw new NotFoundException()});
        if(!campaign){
            throw new NotFoundException('Campaign not found with this name');
        }
        await this.leadModel.deleteMany({
            campaign: campaign.id
        }).exec().catch(()=>{
            throw new NotFoundException();
        });
        await this.campaignModel.deleteOne({
            _id: campaign.id
        }).exec();

        return;
       


    }
}
