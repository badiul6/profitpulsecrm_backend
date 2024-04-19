import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { GetUser, Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/schema';
import { ReqUser } from 'src/auth/dto';
import { CreateTicketDto } from './dto';

@Controller('ticket')
export class TicketController {
    constructor(private ticketservice: TicketService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.CSAGENT)
    create(@GetUser() user:ReqUser, @Body() dto: CreateTicketDto){
        return this.ticketservice.create(user, dto);
    }
}
