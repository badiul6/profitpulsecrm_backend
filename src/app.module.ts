  import { Module } from '@nestjs/common';
  import { AuthModule } from './auth/auth.module';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { ProfileModule } from './profile/profile.module';
  import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from './contact/contact.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { TemplateModule } from './template/template.module';
import { WebsiteModule } from './website/website.module';
import { MailingModule } from './mailing/mailing.module';
import { CampaignModule } from './campaign/campaign.module';
import { DealModule } from './deal/deal.module';
import { ProductModule } from './product/product.module';
import { ListModule } from './list/list.module';

  @Module({
    imports: [
      NestjsFormDataModule.config({isGlobal:true}),
      ConfigModule.forRoot({isGlobal: true}),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('DATABASE_URL'),
        }), 
        inject: [ConfigService],
      }),
      AuthModule,
      ProfileModule,
      ContactModule,
      TemplateModule,
      WebsiteModule,
      MailingModule,
      CampaignModule,
      DealModule,
      ProductModule,
      ListModule],
       })
  export class AppModule {}