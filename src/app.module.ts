  import { Module } from '@nestjs/common';
  import { AuthModule } from './auth/auth.module';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { ProfileModule } from './profile/profile.module';
  import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from './contact/contact.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

  @Module({
    imports: [
      NestjsFormDataModule.config({isGlobal:true}),
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('DATABASE_URL'),
        }), 
        inject: [ConfigService],
      }),
      AuthModule,
      ProfileModule,
      ContactModule],
       })
  export class AppModule {}