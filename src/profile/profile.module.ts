import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    AuthModule
  ]
})
export class ProfileModule {


}
