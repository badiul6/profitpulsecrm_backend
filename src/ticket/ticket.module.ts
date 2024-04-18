import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket, TicketSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [
    MongooseModule.forFeature([ 
      {name: Ticket.name, schema: TicketSchema},
    ]),
    AuthModule
  ]
})
export class TicketModule {}
