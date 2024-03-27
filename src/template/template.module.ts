import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { AuthModule } from 'src/auth/auth.module';
import { Template, TemplateSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports:[
    AuthModule,
    MongooseModule.forFeature([
      {name: Template.name, schema: TemplateSchema}
    ]),
  ]
})
export class TemplateModule {}
