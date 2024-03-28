import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';

@Controller('website')
export class WebsiteController {
    constructor(private websiteService: WebsiteService){}

    @Post('connect')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    connectwebsite(@GetUser() user:ReqUser){
        return this.websiteService.connectWebsite(user);
    }
    
    @Get('get-connection')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getConnection(@GetUser() user:ReqUser){
        return this.websiteService.getConnection(user);
    }
    
    @Delete('disconnect')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    disconnectwebsite(@GetUser() user:ReqUser){
        return this.websiteService.disconnectWebsite(user);
    }


    


    //add
    //remove
    //addcontact

}
