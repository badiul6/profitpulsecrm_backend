import { Module } from '@nestjs/common';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { AuthModule } from 'src/auth/auth.module';
import { Deal, DealSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';
import { ProductModule } from 'src/product/product.module';
import { CampaignModule } from 'src/campaign/campaign.module';
import { SaleModule } from 'src/sale/sale.module';

@Module({
  controllers: [DealController],
  providers: [DealService],
  imports:[
    MongooseModule.forFeature([ 
      {name: Deal.name, schema: DealSchema},
    ]),

    AuthModule,
    ContactModule,
    ProductModule,
    CampaignModule,
    SaleModule
  ]
})
export class DealModule {}
