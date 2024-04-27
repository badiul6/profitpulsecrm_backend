import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AdAccount, Campaign, FacebookAdsApi } from 'facebook-nodejs-business-sdk';
import { ReqUser } from 'src/auth/dto';
import { ConnectDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema';
import { Model } from 'mongoose';
import { Facebook } from './schema';
import axios from 'axios';
const api = FacebookAdsApi.init('EAAFtGqh0QloBO1JUhMTLZCAQi0qxGmSKE4AEO8bGFAm1XOWv3TwmgWVOCsUUIHc2FlJT6YHrHLc7HvGo39EJIu9gUpyHhFLu1OCKBEVwj28Baxng9EKuxmUtraZApcbBd7UKUiOijxCgZBAZBYs1lVBdj9IvWyTVPg75wjQ3YtZBZAv1bqtC42rPSS');
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FacebookService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Facebook.name) private fbModel: Model<Facebook>,
        private configService: ConfigService
    ){}
    
    async connect(user:ReqUser, connectDto:ConnectDto){
        const userinDb= await this.userModel.findById(user.id).exec();
        const appId= this.configService.get('FBAPPID');
        const appSecret= this.configService.get('FBAAPPSECRET');
        const shortLivedAccessToken= connectDto.access_token;
        const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedAccessToken}`;
        try {
            const response = await axios.get(url);
            await this.fbModel.create({
                access_token: response.data.access_token,
                company:userinDb.company
            });

        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Facebook ads already connected');
            }
            if(error.response.status===400){
                throw new BadRequestException('Invalid access token');
            }
        }
    }

    async disconnect(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        await this.fbModel.findOneAndDelete({
            company: userinDb.company
        })
        .exec()
        .catch(()=> {
            throw new NotFoundException('No facebook connection found')
        });
    }


    async get(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        const fbConnection= await this.fbModel.findOne({company:userinDb.company}).exec();
        if(!fbConnection){
            throw new NotFoundException('Facebook connection not found')
        }
        const url = `https://graph.facebook.com/v10.0/me/adaccounts?access_token=${fbConnection.access_token}`;
        try {
            const response = await axios.get(url);
            const accountId= response.data.data[0].id;
            const account = new AdAccount(accountId);
            const fields = ['id', 'name', 'status', 'objective'];
            const params = { limit: 100 };  // Adjust limit as necessary
            const campaigns = await account.getCampaigns(fields, params);
            const campaignObj= campaigns[0]._data;

            const campaign = new Campaign(campaignObj.id);
            const fields2 = [
                'impressions',
                'reach',
                'clicks',
                'ctr',
                'cpc',
                'cpm',
                'spend',
                'cost_per_inline_link_click',
                'conversion_values',
                'conversions',
                'cost_per_conversion',
                'frequency',
                'ad_id',
                'campaign_name'
            ];
            const params2 = {
                level: 'campaign',
                date_preset: 'maximum'  // Customize based on your needs
            };
            const insights = await campaign.getInsights(fields2, params2);
            return insights[0]._data;
            
        } catch (error) {
            throw new NotFoundException()
        }
      
    }

    async getConnection(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        const fbConnection= await this.fbModel.findOne({company:userinDb.company}).exec();
        if(!fbConnection){
            throw new NotFoundException('Facebook connection not found')
        }
        return;
    }
   
}
