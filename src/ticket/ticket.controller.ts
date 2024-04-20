import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/schema';
import { ReqUser } from 'src/auth/dto';
import { AddProgressDto, CreateTicketDto, SearchTicketDto, UpdateStatusDto } from './dto';

@Controller('ticket')
export class TicketController {
    constructor(private ticketservice: TicketService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    create(@GetUser() user:ReqUser, @Body() dto: CreateTicketDto){
        return this.ticketservice.create(user, dto);
    }
    @Get('search')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    search(@Query() dto: SearchTicketDto){
        return this.ticketservice.search(dto);
    }

    @Patch('progress')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    addProgress(@Body() dto: AddProgressDto){
        return this.ticketservice.addProgress(dto);
    }

    @Patch('status')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    updateStatus(@Body() dto: UpdateStatusDto){
        return this.ticketservice.updateStatus(dto);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    getAll(@GetUser()user:ReqUser){
        return this.ticketservice.getAll(user);
    }
}
