import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { RenameTemplateDto, SearchTemplateDto, TemplateDto } from './dto';

@Controller('template')
export class TemplateController {
    constructor(private templateService: TemplateService){}

    @Post('save')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    addTemplate(@GetUser() user: ReqUser, @Body() templateDto:TemplateDto){
        return this.templateService.saveTemplate(user, templateDto);
    }

    @Get('get-all')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getAllTemplates(@GetUser() user: ReqUser){
        return this.templateService.getAllTemplates(user);
    }
    
    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getTemplate(@GetUser() user: ReqUser, @Query() dto:SearchTemplateDto){
        return this.templateService.getTemplate(user, dto);
    }

    @Patch('rename')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    renameTemplate(@GetUser() user: ReqUser, @Body() renameDto:RenameTemplateDto){
        return this.templateService.renameTemplate(user, renameDto);
    }

    @Delete('delete')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    deleteTemplate(@Query() dto:SearchTemplateDto, @GetUser() user:ReqUser){
        return this.templateService.deleteTemplate(dto, user);
    }
}
