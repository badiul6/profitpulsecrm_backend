import { Module } from '@nestjs/common';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { AuthModule } from 'src/auth/auth.module';
import { Facebook, FacebookSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FacebookController],
  providers: [FacebookService],
  imports:[
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([ 
      {name: Facebook.name, schema: FacebookSchema}
    ]),
  ]
})
export class FacebookModule {}
