import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AuthModule } from 'src/auth/auth.module';
import { Contact, ContactSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports:[AuthModule,
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),]
})
export class ContactModule {}
