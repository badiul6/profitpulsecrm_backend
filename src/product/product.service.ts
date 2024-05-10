import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { ProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async add(user:ReqUser, productDto: ProductDto){
        const userinDb= await this.userModel.findById(user.id);
        await this.productModel.create({
            name:productDto.name,
            description: productDto.description,
            quantity: productDto.quantity,
            unit_price: productDto.unit_price,
            company: userinDb.company
        }).catch(e=>{
            if (e.code === 11000) {
                throw new ConflictException('Product already exists');
            }        
        });
        return;
    }
    async get(user:ReqUser){
        const userinDb= await this.userModel.findById(user.id);
        const products= await this.productModel.find({company:userinDb.company},{
            _id:0,
            name:1,
            description:1,
            unit_price:1,
            quantity:1
        }).sort({updatedAt:-1}) .exec()
        .catch(()=>{
            throw new NotFoundException();
        }); 
        return {products: products};
    }
    async update(user: ReqUser, updateDto:UpdateProductDto){
        const userinDb= await this.userModel.findById(user.id);
        await this.productModel.findOneAndUpdate(
            {
                name: updateDto.name,
                company: userinDb.company
            },
            {
                name: updateDto.new_name,
                description: updateDto.description,
                unit_price: updateDto.unit_price,
                quantity:updateDto.quantity
            },
            {new:true}
        ).exec().catch(()=>{
            throw new NotFoundException();
        }).then(e=>{
            if(e==null){
                throw new NotFoundException('No product found with this name');
            }
        });
        return;
    }

    async delete(user:ReqUser, productName:string){
        try{
            const userinDb= await this.userModel.findById(user.id).exec();
            const product=await this.productModel.findOneAndDelete({name:productName, company:userinDb.company}).exec();

            if(product==null){
                throw new NotFoundException('Product not found');
            }
        }
        catch(error){
            throw new NotFoundException('Product not found');
        }
    }
}
