import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/schema';
import { ReqUser } from 'src/auth/dto';
import { ConnectDto } from './dto';

@Controller('facebook')
export class FacebookController {
    constructor(private facebookService:FacebookService){}

    @Post()
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    connect(@GetUser() user:ReqUser, @Body() connectDto:ConnectDto){
        return this.facebookService.connect(user,connectDto);
    }

    @Delete()
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    disconnect(@GetUser() user:ReqUser){
        return this.facebookService.disconnect(user);
    }
    
    @Get()
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    get(@GetUser() user:ReqUser){
        return this.facebookService.get(user);
    }

    @Get('connection')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getConnection(@GetUser() user:ReqUser){
        return this.facebookService.getConnection(user);
    }
}
