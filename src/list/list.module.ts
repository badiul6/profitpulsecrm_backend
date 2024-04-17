import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { List, ListSchema } from './schema';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ListController],
  providers: [ListService],
  imports: [
    MongooseModule.forFeature([ 
      {name: List.name, schema: ListSchema},
    ]),
    AuthModule
  ]
})
export class ListModule {}
