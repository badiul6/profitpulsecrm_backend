import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReqUser } from 'src/auth/dto';
import { TemplateDto } from './dto';
import { Template } from './schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RenameTemplateDto } from './dto/renameTemplate.dto';

@Injectable()
export class TemplateService {

    constructor(@InjectModel(Template.name) private templateModel: Model<Template>) { }

    async addTemplate(user: ReqUser, templateDto: TemplateDto) {
        try {
            const template = await this.templateModel.create({
                name: templateDto.name,
                body: templateDto.body,
                user: user.id
            });
            return;
        } catch (error) {
            if (error.code === 11000) {
                // Handle duplicate key error (E11000)
                throw new ConflictException('Template with the same name already exists for this user.');
            }
            console.error(error);
        }
    }

    async getTemplate(user: ReqUser) {
        try {
            const templates = await this.templateModel.find({ user: user.id }).sort({ updatedAt: -1 }).exec();
            return templates;
        } catch (error) {
            console.error(error);
        }
    }

    async updateTemplate(user: ReqUser, templateDto: TemplateDto) {
        const template = await this.templateModel.findOneAndUpdate(
            { name: templateDto.name, user: user.id },
            { body: templateDto.body },
            { new: true }
        ).exec();
        if (!template) {
            throw new NotFoundException('Template not found.');
        }
        return;
    }

    async renameTemplate(user: ReqUser, renameDto: RenameTemplateDto) {
        const template = await this.templateModel.findOneAndUpdate(
            { name: renameDto.name, user: user.id },
            { name: renameDto.newname },
            { new: true }
        ).exec();
        if (!template) {
            throw new NotFoundException('Template not found.');
        }
        return;
    }
    
    async deleteTemplate(name: string, user: ReqUser) {
        const template = await this.templateModel.findOneAndDelete({ name, user: user.id }).exec();
        if (template == null) {
            throw new NotFoundException('User Not Found');
        }
        return;
    }
}
