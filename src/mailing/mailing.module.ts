import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gmail, GmailSchema } from './schema';
import { ContactModule } from 'src/contact/contact.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MailingController],
  providers: [MailingService],
  imports:[
    MongooseModule.forFeature([ 
      {name: Gmail.name, schema: GmailSchema}
    ]),
    ContactModule,
    AuthModule
  ]
})
export class MailingModule {}
