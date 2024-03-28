import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AuthModule } from 'src/auth/auth.module';
import { Connection, ConnectionSchema, Contact, ContactSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteModule } from 'src/website/website.module';


@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports:[
    AuthModule,
    WebsiteModule,
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema }, 
      {name: Connection.name, schema: ConnectionSchema}
    ]),
]
})
export class ContactModule {}
