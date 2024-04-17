import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddInteractionDto, CancelledDealDto, CompletedDealDto, CreateDealDto } from './dto';
import { Deal, Sale, Status } from './schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from 'src/auth/schema';
import { ReqUser } from 'src/auth/dto';
import { Contact } from 'src/contact/schema';
import { Product } from 'src/product/schema';


@Injectable()
export class DealService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Deal.name) private dealModel: Model<Deal>,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(Sale.name) private saleModel: Model<Sale>,
    ){}

    async create(createDto: CreateDealDto, user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();

        const agent= await this.userModel.findOne({
            email:createDto.agent_email,
            company:userinDb.company
        }).exec().catch(error=>{console.log(error);});
        
        if(!agent){
            throw new NotFoundException('Agent Doesnot Exist');
        }

        const contact= await this.contactModel.findOne({
            email: createDto.contact_email,
            company: agent.company
        }).exec().catch(error=>{console.log(error);});
        
        if(!contact){
            throw new NotFoundException('Contact Doesnot Exist');
        }

        await this.dealModel.create({
            status: Status.CREATED,
            user: agent.id,
            contact: contact.id
        }).catch(error=>{
            if (error.code === 11000) {
                throw new ConflictException('Deal already created for this contact');
            }
            console.log(error);
        });
        return;

    }
    async getAgents(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();
        const users= await this.userModel.find(
            {
                company: userinDb.company,
                'roles.0': Role.SAGENT 
            }).select('-_id fullname email')
            .exec().catch(()=>{
                throw new NotFoundException();
            });
        if(users.length==0){
            throw new NotFoundException('No Sales Agent');
        }
        return {
            data: users
        }
    }

    async get(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id).exec();

        const deals = await this.dealModel.aggregate([
            {
                $lookup: {
                    from: "users", // Name of the User collection
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "contacts", // Name of the Contact collection
                    localField: "contact",
                    foreignField: "_id",
                    as: "contact"
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
                $unwind: "$contact" // Unwind the contact array to get individual contact objects
            },
            {
                $sort: {
                    createdAt: -1 // Sort by createdAt field in descending order (newest first)
                }
            },  
            {
                $project: {
                    _id:0,
                    createdAt: 0, 
                    updatedAt: 0,
                    __v: 0,
                    "user._id": 0,
                    "user.password": 0,
                    "user.roles": 0,
                    "user.company": 0,
                    "user.__v": 0,
                    "contact._id": 0,
                    "contact.company": 0,
                    "contact.__v": 0,
                }
            }
        ]).exec().catch(()=>{
            throw new NotFoundException();
        });
        if(deals.length==0){
            throw new NotFoundException();
        }
        return {
            data: deals
        };
    }

    async getDeals(user:ReqUser){
        const deals= await this.dealModel.find({
            user: user.id
        }).populate({
            path: 'contact',
            select: 'fullname email phone companyname jobtitle -_id'
        })
        .select('-_id -user -createdAt -updatedAt -__v')
        .sort({ createdAt: -1 })
        .exec().catch(()=>{
            throw new NotFoundException();
        });
        if (deals.length==0){
            throw new NotFoundException('No deals associated to this agent');
        }
        return {
            data: deals
        }
    }

    async addInteraction(user: ReqUser, addInteractionDto: AddInteractionDto){
        const userinDb= await this.userModel.findById(user.id).exec();
        const contact= await this.contactModel.findOne(
            {
                email:addInteractionDto.contact_email,
                company: userinDb.company
            }
        ).exec();
        if(!contact){
            throw new NotFoundException();
        }
        const deal= await this.dealModel.findOne(
            {
                user: user.id,
                contact: contact.id
            }
        ).exec();
        if(!deal){
            throw new NotFoundException('No deal Found');
        }
        deal.status=Status.INPROGRESS;
        deal.interactions.push(addInteractionDto.interaction_msg)
        await deal.save();
        return;
    }

    async dealCompleted(user:ReqUser, dto: CompletedDealDto){
        const userinDb= await this.userModel.findById(user.id).exec();

        const contact= await this.contactModel.findOne({
            email: dto.contact_email,
            company:userinDb.company
        }).exec();
        if(!contact){
            throw new NotFoundException('Contact Not Found');
        }

        const productNames = dto.products.map(product => product.name);

        const products = await this.productModel.find({ 
            company: userinDb.company, 
            name: { $in: productNames }, 
          }).exec().catch(()=>{throw new NotFoundException();});
          if(products.length==0){throw new NotFoundException();}
    
        dto.products.forEach(async dtoProduct =>{
            const p=  products.find(product=> product.name==dtoProduct.name);
            p.quantity= p.quantity-dtoProduct.quantity;

            dtoProduct['productId']= p.id;
            dtoProduct['unit_price']= p.unit_price;
            const totalPrice= dtoProduct.quantity*p.unit_price;
            dtoProduct['total_price']= totalPrice;
            const discountAmount = (totalPrice * dtoProduct.discount) / 100;
            dtoProduct['net_price']= totalPrice- discountAmount;

            await p.save();
        });

        await this.saleModel.create(
            {
                contact: contact.id,
                sales_channel: dto.sales_channel,
                payment_method: dto.payment_method,
                shipping_address: dto.shipping_address,
                billing_address: dto.billing_address,
                location: dto.location,
                shipping_cost: dto.shipping_cost,
                notes: dto.notes,
                products: dto.products,
                user:user.id
            }
        ).then(async () =>{
            await this.dealModel.findOneAndUpdate(
            {
                user: user.id,
                contact: contact.id
            },
            {
               status: Status.COMPLETED 
            }
        ).exec();
        });
    }

    async dealCancelled(user:ReqUser, dto: CancelledDealDto){
        const userinDb= await this.userModel.findById(user.id).exec();

        const contact= await this.contactModel.findOne({
            email: dto.contact_email,
            company:userinDb.company
        }).exec();
        if(!contact){
            throw new NotFoundException('Contact Not Found');
        }
        const deal=await this.dealModel.findOneAndUpdate(
            {
                user:user.id,
                contact: contact.id
            },
            {
                status: Status.CANCELLED
            }
        ).exec().catch(()=>{
            throw new NotFoundException();
        });
        if(!deal){
            throw new NotFoundException();
        }
        return;

    }

   

}
