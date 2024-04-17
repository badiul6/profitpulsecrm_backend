import { Body, Controller, Delete, Get, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { CampaignService } from './campaign.service';
import { CampaignDto, ClickDto } from './dto';

@Controller('campaign')
export class CampaignController {
    constructor(private campaignService: CampaignService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    create(@GetUser() user: ReqUser, @Body() campaignDto:CampaignDto){
        return this.campaignService.create(user, campaignDto);
    }

    @Get('click')
    @Redirect('',302)
    trackLinkClick(@Query() clickDto: ClickDto) {
        return this.campaignService.trackClick(clickDto);
    }
    
    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT, Role.SAGENT)
    getCompaign(@Query() campaignDto:CampaignDto, @GetUser() user:ReqUser){
        return this.campaignService.getCampaign(campaignDto, user)

    }

    @Get('get-all')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT, Role.SAGENT)
    getAllCompaign(@GetUser() user:ReqUser){
        return this.campaignService.getAllCampaign(user)
    }

    @Get('leads')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    getAllLeads(@Query() campaignDto: CampaignDto, @GetUser() user:ReqUser){
        return this.campaignService.getAllLeads(campaignDto, user);
    }

    @Delete('delete')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT, Role.SHEAD)
    deleteCampaign(@GetUser() user:ReqUser, @Query()dto:CampaignDto){
        return this.campaignService.deleteCampaign(user, dto);
    }

}
