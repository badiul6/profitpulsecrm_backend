import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { GetDto, ListDto } from './dto';

@Controller('list')
export class ListController {
    constructor(private listService: ListService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    create(@GetUser() user: ReqUser, @Body() dto:ListDto){
        return this.listService.create(user, dto);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    get(@GetUser() user: ReqUser, @Query() getDto:GetDto){
        return this.listService.get(user, getDto);
    }

    @Get('get-all')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    getAll(@GetUser() user: ReqUser){
        return this.listService.getAll(user);
    }

    @Patch('update')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    update(@GetUser() user: ReqUser, @Body() dto:ListDto){
        return this.listService.update(user, dto);
    }

    @Delete('delete')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.MAGENT)
    delete(@GetUser() user: ReqUser, @Query() dto:GetDto){
        return this.listService.delete(user, dto);
    }
}
