import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AuthModule } from 'src/auth/auth.module';
import { Connection, ConnectionSchema, Contact, ContactSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema }, 
      {name: Connection.name, schema: ConnectionSchema}
    ]),
    // MailerModule.forRoot({
    //   // transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    //   transport:{
    //     host: 'smtp.gmail.com',
    //   port:465,
    //   secure: true,
    //   auth:{
    //     user: 'badiuljamal3208@gmail.com',
    //     pass: 'iorbhslhkxitsfht'
    //   }
    //   }, defaults: {
    //     from: '"No Reply" <no-reply@localhost>',
    //   },
    //   preview: true,  
    //   template: {
    //     dir: __dirname + '/templates',
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  // MailerModule.forRoot({
  //   transport:{
  //     host: 'smtp.gmail.com',
  //     port:465,
  //     secure:true,
  //     auth:{
  //       user: 'badiuljamal3208@gmail.com',
  //       pass: 'iorbhslhkxitsfht'
  //     }
  //   }
  // })
]
})
export class ContactModule {}
