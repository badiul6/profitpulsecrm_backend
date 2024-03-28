import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from './schema';

@Module({
  providers: [WebsiteService],
  controllers: [WebsiteController],
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      {name: Website.name, schema: WebsiteSchema}
    ]),
  ]
})
export class WebsiteModule {}
