import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AdAccount,
  Campaign,
  FacebookAdsApi,
} from 'facebook-nodejs-business-sdk';
import { ReqUser } from 'src/auth/dto';
import { ConnectDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/schema';
import { Model } from 'mongoose';
import { Facebook } from './schema';
import axios from 'axios';
const api = FacebookAdsApi.init(
  'EAAFtGqh0QloBO1JUhMTLZCAQi0qxGmSKE4AEO8bGFAm1XOWv3TwmgWVOCsUUIHc2FlJT6YHrHLc7HvGo39EJIu9gUpyHhFLu1OCKBEVwj28Baxng9EKuxmUtraZApcbBd7UKUiOijxCgZBAZBYs1lVBdj9IvWyTVPg75wjQ3YtZBZAv1bqtC42rPSS',
);
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FacebookService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Facebook.name) private fbModel: Model<Facebook>,
    private configService: ConfigService,
  ) {}

  async connect(user: ReqUser, connectDto: ConnectDto) {
    const userinDb = await this.userModel.findById(user.id).exec();
    const appId = this.configService.get('FBAPPID');
    const appSecret = this.configService.get('FBAAPPSECRET');
    const shortLivedAccessToken = connectDto.access_token;

    const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedAccessToken}`;
    try {
      const response = await axios.get(url);
      await this.fbModel.create({
        access_token: response.data.access_token,
        company: userinDb.company,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Facebook ads already connected');
      }
      if (error.response.status === 400) {
        throw new BadRequestException('Invalid access token');
      }
    }
  }

  async disconnect(user: ReqUser) {
    const userinDb = await this.userModel.findById(user.id).exec();
    await this.fbModel
      .findOneAndDelete({
        company: userinDb.company,
      })
      .exec()
      .catch(() => {
        throw new NotFoundException('No facebook connection found');
      });
  }

  async get(user: ReqUser) {
    const userinDb = await this.userModel.findById(user.id).exec();
    const fbConnection = await this.fbModel
      .findOne({ company: userinDb.company })
      .exec();
    if (!fbConnection) {
      throw new NotFoundException('Facebook connection not found');
    }
    const url = `https://graph.facebook.com/v10.0/me/adaccounts?access_token=${fbConnection.access_token}`;
    try {
      const response = await axios.get(url);
      const accountId = response.data.data[0].id;
      const account = new AdAccount(accountId);
      const campFields = ['id', 'name', 'status', 'objective'];
      const campParams = { limit: 100 }; // Adjust limit as necessary
      const campaigns = await account.getCampaigns(campFields, campParams);
      const campaignObj = campaigns[0]._data;

      const campaign = new Campaign(campaignObj.id);

      const dayFields = [
        'clicks',
        'impressions',
        'date_start', // To get the date for each data point
      ];

      const dayParams = {
        time_range: { since: '2021-06-01', until: '2024-05-01' }, // Specify the time range you want
        time_increment: 1, // Aggregate data by day
      };

      const dayWiseInsights = await campaign.getInsights(dayFields, dayParams);

      // Process the insights data to get clicks per day
      const clicksPerDay = {};
      const impressionsPerDay = {};

      dayWiseInsights.forEach((insight) => {
        const date = insight.date_start;
        const clicks = insight.clicks;
        const impressions = insight.impressions;

        if (!clicksPerDay[date]) {
          clicksPerDay[date] = 0;
        }
        clicksPerDay[date] += clicks;

        if (!impressionsPerDay[date]) {
          impressionsPerDay[date] = 0;
        }
        impressionsPerDay[date] += impressions;
      });

      const totalFeilds = [
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
        'campaign_name',
      ];
      const totalParams = {
        level: 'campaign',
        date_preset: 'maximum', // Customize based on your needs
      };

      const totalInsights = await campaign.getInsights(
        totalFeilds,
        totalParams,
      );

      console.log(totalInsights[0]._data);

      return {
        overall_stats: totalInsights[0]._data || {},
        day_wise_clicks: clicksPerDay || {},
        day_wise_insights: impressionsPerDay || {},
      };
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async getConnection(user: ReqUser) {
    const userinDb = await this.userModel.findById(user.id).exec();
    const fbConnection = await this.fbModel
      .findOne({ company: userinDb.company })
      .exec();

    return { connected: fbConnection !== null };
  }
}
