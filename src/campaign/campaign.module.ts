import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema, Lead, LeadSchema } from './schema';
import { AuthModule } from 'src/auth/auth.module';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  providers: [CampaignService],
  controllers: [CampaignController],
  imports:[
    MongooseModule.forFeature([ 
      {name: Campaign.name, schema: CampaignSchema},
      {name: Lead.name, schema: LeadSchema}
    ]),
    AuthModule,
    ContactModule
  ],
  exports:[MongooseModule]
})
export class CampaignModule {}
