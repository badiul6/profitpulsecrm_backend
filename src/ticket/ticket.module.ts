import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket, TicketSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [
    MongooseModule.forFeature([ 
      {name: Ticket.name, schema: TicketSchema},
    ]),
    AuthModule,
    ContactModule
  ]
})
export class TicketModule {}
