import { Injectable } from '@nestjs/common';
import { Ticket, TicketStatus } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,

    ){}
    async create(){
        await this.ticketModel.create({
            status:TicketStatus.CREATED
        });
        return;
    }
}
