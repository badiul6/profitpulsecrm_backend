import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from './schema';
import { SaleDto, SalesFileDto } from './dto';
import { ReqUser } from 'src/auth/dto';
import { User } from 'src/auth/schema';
import { Contact } from 'src/contact/schema';
import { Product } from 'src/product/schema';

@Injectable()
export class SaleService {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<Sale>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Product.name) private productModel: Model<Product>,


    ){}
    async importFile(user:ReqUser, fileDto:SalesFileDto){
        const jsonData = JSON.parse(fileDto.file.buffer.toString());

        for (const obj of jsonData) {
            obj['user'] = user.id;
        }
        try {
            //uploading contacts ignoring duplicates
            await this.saleModel.insertMany(jsonData, { ordered: false });
        }
        finally {
            return;
        }
    }

    async addSale(user:ReqUser, dto:SaleDto){
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
          
        if(products.length==0){throw new NotFoundException('Products not found');}
        dto.products.forEach(async dtoProduct =>{
            const p=  products.find(product=> product.name==dtoProduct.name);
            p.quantity= p.quantity-dtoProduct.quantity;

            dtoProduct['name']= p.name;
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
        ).catch(()=>{
            throw new NotAcceptableException();
        });
        return;
    }

    async get(user:ReqUser){
        const sales=  await this.saleModel.find(
            {
                user: user.id
            },
            {
                _id:0,
                products:1,
                sales_channel:1,
                payment_method:1,
                shipping_address:1,
                billing_address:1,
                location:1,
                shipping_cost:1,
                notes:1,
            }
            
        ).populate({
            path: 'contact',
            select: '-_id fullname email phone companyname jobtitle' // Only include the 'name' field from the contact document
        })
        .sort({ createdAt: -1 })
        .exec().catch(()=>{
            throw new NotFoundException();
        });
        return {
            data:sales
        }
    }

    async getAll(user:ReqUser){
        const userinDB= await this.userModel.findById(user.id).exec();
        const sales = await this.saleModel.aggregate([
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
                    "user.company": userinDB.company
                }
            },
            {
                $unwind: "$user" // Unwind the user array to get individual user objects

            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true // Keep documents even if the contact array is empty
                }
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
                    "user.verificationlink": 0,
                    "user.isVerified": 0,
                    "contact._id": 0,
                    "contact.company": 0,
                    "contact.__v": 0,
                    "contact.createdAt": 0,
                    "contact.updatedAt": 0,
                }
            }
        ]).exec().catch(()=>{
            throw new NotFoundException();
        });
        
        return {
            data: sales
        }
        
    }
}
