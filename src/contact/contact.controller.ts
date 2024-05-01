import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { ContactService } from './contact.service';
import { ReqUser } from 'src/auth/dto';
import { ContactDto, ContactFileDto, SearchContactDto } from './dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService){}
    
    @Post('import-file')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    @FormDataRequest()
    importFile(@GetUser() user: ReqUser, @Body() fileDto: ContactFileDto){
        return this.contactService.importFile(user, fileDto);
    }
    @Get('get-all')
    @UseGuards(AuthenticatedGuard)
    getContacts(@GetUser() user: ReqUser){
        return this.contactService.getContacts(user);
    }

    @Post('add/:code')
    addContact(@Param('code') code:string, @Body() contactDto: ContactDto){
        return this.contactService.addContact(code, contactDto);     
    }

    @Post('create')
    @UseGuards(AuthenticatedGuard)
    createContact(@GetUser() user:ReqUser, @Body() contactDto: ContactDto){
        return this.contactService.createContact(user, contactDto);     
    }

    @Patch('update')
    @UseGuards(AuthenticatedGuard)
    updateContact(@GetUser() user:ReqUser, @Body() contactDto: ContactDto){
        return this.contactService.updateContact(user, contactDto);     
    }

    @Get('search')
    @UseGuards(AuthenticatedGuard)
    searchContact(@GetUser() user:ReqUser, @Query()dto: SearchContactDto){
        return this.contactService.searchContact(user, dto);
    }

}