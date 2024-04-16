import { Module } from '@nestjs/common';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { AuthModule } from 'src/auth/auth.module';
import { Deal, DealSchema, Sale, SaleSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [DealController],
  providers: [DealService],
  imports:[
    MongooseModule.forFeature([ 
      {name: Deal.name, schema: DealSchema},
      {name: Sale.name, schema: SaleSchema}
    ]),

    AuthModule,
    ContactModule,
    ProductModule
  ]
})
export class DealModule {}
