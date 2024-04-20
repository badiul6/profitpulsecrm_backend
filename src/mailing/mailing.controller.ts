import { Body, Controller, Delete, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { ConnectGmailDto, MarketingEmailsDto } from './dto';
import { Role } from 'src/auth/schema';

@Controller('mailing')
export class MailingController {
    constructor(private mailingService: MailingService){}
    
    @Post('connect-gmail')
    @UseGuards(AuthenticatedGuard)
    connectGmail(@GetUser() user: ReqUser, @Body() connectionDto: ConnectGmailDto){
        return this.mailingService.connectGmail(user, connectionDto);
    }

    @Delete('disconnect')
    @UseGuards(AuthenticatedGuard)
    disconnectGmail(@GetUser() user:ReqUser){
        return this.mailingService.disconnectGmail(user);
    }

    @Get('get-messages')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT, Role.CSAGENT)
    getGmailMessages(@GetUser() user: ReqUser){
        return this.mailingService.getEmailMessages(user);
    }

    @Post('send-marketing-emails')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    sendEmails(@GetUser() user: ReqUser, @Body() emailDto: MarketingEmailsDto){
        return this.mailingService.sendMarketingEmails(user, emailDto);
    }   
}