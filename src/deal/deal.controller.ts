import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { DealService } from './deal.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { GetUser, Roles } from 'src/auth/decorator';
import { AddInteractionDto, CompletedDealDto, CreateDealDto } from './dto';
import { ReqUser } from 'src/auth/dto';

@Controller('deal')
export class DealController {
    constructor(private dealService: DealService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    create(@Body() createDto: CreateDealDto, @GetUser() user: ReqUser){
        return this.dealService.create(createDto, user);
    }
    
    @Get('get-agents')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    getAgents(@GetUser() user:ReqUser){
        return this.dealService.getAgents(user);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    get(@GetUser() user:ReqUser){
        return this.dealService.get(user);
    }
    
    @Get('get-deals')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    getDeals(@GetUser() user:ReqUser){
        return this.dealService.getDeals(user);
    }

    @Patch('add-interaction')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    addInteraction(@GetUser() user: ReqUser, @Body()addInteractionDto: AddInteractionDto){
        return this.dealService.addInteraction(user, addInteractionDto);
    }
    
    @Post('completed')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    dealCompleted(@GetUser() user: ReqUser, @Body() completedDealDto: CompletedDealDto){
        return this.dealService.dealCompleted(user, completedDealDto);
    }
    
}