import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { TemplateDto } from './dto';
import { RenameTemplateDto } from './dto/renameTemplate.dto';

@Controller('template')
export class TemplateController {
    constructor(private templateService: TemplateService){}

    @Post('add')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    addTemplate(@GetUser() user: ReqUser, @Body() templateDto:TemplateDto){
        return this.templateService.addTemplate(user, templateDto);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getTemplate(@GetUser() user: ReqUser){
        return this.templateService.getTemplate(user);
    }
    


    @Patch('update')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    updateTemplate(@GetUser() user: ReqUser, @Body() templateDto:TemplateDto){
        return this.templateService.updateTemplate(user, templateDto);
    }

    @Patch('rename')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    renameTemplate(@GetUser() user: ReqUser, @Body() renameDto:RenameTemplateDto){
        return this.templateService.renameTemplate(user, renameDto);
    }

    @Delete('delete/:name')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    deleteTemplate(@Param('name') name:string, @GetUser() user:ReqUser){
        return this.templateService.deleteTemplate(name, user);
    }
}
