import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { ConnectGmailDto, InReplyToDto, MarketingEmailsDto, ReadMsgDto, SendEmailDto } from './dto';
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
    @UseGuards(AuthenticatedGuard)
    getGmailMessages(@GetUser() user: ReqUser){
        return this.mailingService.getEmailMessages(user);
    }

    @Post('send-marketing-emails')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    sendMarketingEmails(@GetUser() user: ReqUser, @Body() emailDto: MarketingEmailsDto){
        return this.mailingService.sendMarketingEmails(user, emailDto);
    }

    @Post('send-msg')
    @UseGuards(AuthenticatedGuard)
    sendMessage(@GetUser() user: ReqUser, @Body() dto: SendEmailDto){
        return this.mailingService.sendMessage(user,dto);
    }

    @Post('send-reply')
    @UseGuards(AuthenticatedGuard)
    inReplyTo(@GetUser() user: ReqUser, @Body() dto: InReplyToDto){
        return this.mailingService.inReplyTo(user,dto);
    }

    @Patch('read')
    @UseGuards(AuthenticatedGuard)
    read(@GetUser() user: ReqUser, @Body() dto: ReadMsgDto){
        return this.mailingService.read(user, dto);
    }
    @Get('get-connection')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getConnection(@GetUser() user:ReqUser){
        return this.mailingService.getConnection(user);
    }
}