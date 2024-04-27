import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './schema';
import { ContactModule } from 'src/contact/contact.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  imports:[
    MongooseModule.forFeature([ 
      {name: Sale.name, schema: SaleSchema},
    ]),
    ContactModule,
    AuthModule,
    ProductModule
  ],
  exports:[
    MongooseModule
  ]
})
export class SaleModule {}
