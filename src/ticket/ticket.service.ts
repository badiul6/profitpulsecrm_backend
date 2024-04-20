import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket, TicketStatus } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReqUser } from 'src/auth/dto';
import { AddProgressDto, CreateTicketDto, SearchTicketDto, UpdateStatusDto } from './dto';
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
            const ticket= await this.ticketModel.create(
                {
                    issue:dto.issue,
                    status:TicketStatus.CREATED,
                    user:user.id,
                    contact:contact.id
                }
            );
           const returnTicket= {
            ticketNo: ticket.ticketNo,
            status: ticket.status,
            issue: ticket.issue
           }

            return returnTicket;
        }
        catch(error){
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException();
            }
        }
    }

    async search(dto: SearchTicketDto){
        const ticket= await this.ticketModel.findOne({
            ticketNo: dto.ticket_no
        }).select('status issue progress ticketNo -_id').exec();
        if(!ticket){
            throw new NotFoundException()
        }
        return ticket;
    }

    async addProgress(dto: AddProgressDto){
        const ticket= await this.ticketModel.findOneAndUpdate(
            { ticketNo: dto.ticket_no },
            { $push: { progress: dto.progress } },
            { new: true }
        ).select('status issue progress ticketNo -_id').exec();
        if(!ticket){
            throw new NotFoundException()
        }        
        return ticket;
    }

    async updateStatus(dto:UpdateStatusDto){
       const progress= dto.status=='FORWARDED'?"REQUEST FORWARDED TO SALES TEAM":"ISSUE RESOLVED";
       const ticket= await this.ticketModel.findOneAndUpdate(
            { ticketNo: dto.ticket_no },
            { $push: { progress: progress }, status: dto.status },
            { new: true }
        ).select('status issue progress ticketNo -_id').exec();
        
        if(!ticket){
            throw new NotFoundException()
        }        

        return ticket;
    }

    async getAll(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        const tickets = await this.ticketModel.aggregate([
            {
                $lookup: {
                    from: "users", // Name of the User collection
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            
            {
                $match: {
                    "user.company": userinDb.company
                }
            },
            {
                $unwind: "$user" // Unwind the user array to get individual user objects

            },
            {
                $sort: {
                    createdAt: -1 // Sort by createdAt field in descending order (newest first)
                }
            },  
            // {
            //     $project: {
            //         _id:0,
            //         createdAt: 0, 
            //         updatedAt: 0,
            //         __v: 0,
            //         "user._id": 0,
            //         "user.password": 0,
            //         "user.roles": 0,
            //         "user.company": 0,
            //         "user.__v": 0,
            //         "contact._id": 0,
            //         "contact.company": 0,
            //         "contact.__v": 0,
            //     }
            // }
        ]).exec()
        return tickets
    }

}
