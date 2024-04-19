import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket, TicketStatus } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReqUser } from 'src/auth/dto';
import { CreateTicketDto } from './dto';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Contact.name) private contactModel: Model<Contact>
    ){}

    async create(user:ReqUser, dto: CreateTicketDto){
        const userinDb= await this.userModel.findById(user.id).exec();
        const contact= await this.contactModel.findOne({
            email:dto.contact_email,
            company: userinDb.company
        }).exec();
        if(!contact){
            throw new NotFoundException('Contact with this email doesnot exists');
        }
        try{
            await this.ticketModel.create(
                {
                    issue:dto.issue,
                    status:TicketStatus.CREATED,
                    user:user.id,
                    contact:contact.id
                }
            );
            return;
        }
        catch(error){
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException();
            }
        }
    }

    
}
