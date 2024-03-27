import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { ContactService } from './contact.service';
import { ReqUser } from 'src/auth/dto';
import { ConnectGmailDto, ContactFileDto, MarketingEmailsDto } from './dto';
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
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    getContacts(@GetUser() user: ReqUser){
        return this.contactService.getContacts(user);
    }

    @Post('connect-gmail')
    @UseGuards(AuthenticatedGuard)
    connectGmail(@GetUser() user: ReqUser, @Body() connectionDto: ConnectGmailDto){
        return this.contactService.connectGmail(user, connectionDto);
    }
    @Get('get-messages')
    @UseGuards(AuthenticatedGuard)
    getGmailMessages(@GetUser() user: ReqUser){
        return this.contactService.getEmailMessages(user);
    }

    @Post('send-marketing-emails')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT, Role.MAGENT)
    sendEmails(@GetUser() user: ReqUser, @Body() emailDto: MarketingEmailsDto){
        return this.contactService.sendMarketingEmails(user, emailDto);
    }
    
}