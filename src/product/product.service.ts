import { Injectable } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { ProductDto } from './dto';
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
            console.log(e);
        }).then(p=>{
            console.log(p);
        });
    }
}
