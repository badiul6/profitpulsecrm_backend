import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { SearchTemplateDto, TemplateDto } from './dto';
import { Template } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RenameTemplateDto } from './dto/renameTemplate.dto';
import { User } from 'src/auth/schema';

@Injectable()
export class TemplateService {

    constructor(
        @InjectModel(Template.name) private templateModel: Model<Template>,
        @InjectModel(User.name) private userModel: Model<User>
        ) { }

    async saveTemplate(user: ReqUser, templateDto: TemplateDto) {
        const userinDb= await this.userModel.findById(user.id).exec();
        try {
            const template = await this.templateModel.findOneAndUpdate(
                {
                    name:templateDto.name,
                    company: userinDb.company
                },
                {
                    data:templateDto.data,
                    thumbnail:templateDto.thumbnail,
                   
                },
                {
                    new:true,
                    upsert:true
                }
            );
            return {
                template_name: template.name
            };
        } catch (error) {
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException('Template with the same name already exists.');
            }
            console.error(error);
        }
    }

    async getAllTemplates(user: ReqUser) {
        const userinDb= await this.userModel.findById(user.id).exec();
        try {
            const templates = await this.templateModel.find(
                { company: userinDb.company },
                { _id: 0, name: 1, thumbnail: 1, updatedAt: 1 }
            ).sort({ updatedAt: -1 })
            .exec().catch(()=>{throw new NotFoundException()});

            return {
                templates: templates
            };
        } catch (error) {
            console.error(error);
        }
    }

    async getTemplate(user: ReqUser, dto: SearchTemplateDto) {
        const userinDb= await this.userModel.findById(user.id).exec();
        const template = await this.templateModel.findOne(
            { name: dto.name, company: userinDb.company }
        ).select('data -_id').exec();
        if (!template) {
            throw new NotFoundException('Template not found.');
        }
        return template;
    }

    async renameTemplate(user: ReqUser, renameDto: RenameTemplateDto) {
        const userinDb= await this.userModel.findById(user.id).exec();
        const template = await this.templateModel.findOneAndUpdate(
            { name: renameDto.name, company: userinDb.company },
            { name: renameDto.newname },
            { new: true }
        ).exec();
        if (!template) {
            throw new NotFoundException('Template not found.');
        }
        return;
    }

    async deleteTemplate(dto: SearchTemplateDto, user: ReqUser) {
        const userinDb= await this.userModel.findById(user.id).exec();
        const template = await this.templateModel.findOneAndDelete({ 
            name:dto.name, company: userinDb.company 
        }).exec();
        if (template == null) {
            throw new NotFoundException('User Not Found');
        }
        return;
    }
}
