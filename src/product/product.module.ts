import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    MongooseModule.forFeature([ 
      {name: Product.name, schema: ProductSchema},
    ]),
    AuthModule
  ],
  exports:[
    MongooseModule
  ]
})
export class ProductModule {}
