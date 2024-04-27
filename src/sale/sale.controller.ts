import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { GetUser, Roles } from 'src/auth/decorator';
import { SaleDto, SalesFileDto } from './dto';
import { ReqUser } from 'src/auth/dto';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
    constructor(private saleService:SaleService){}

    @Post('import')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    @FormDataRequest()
    importFile(@GetUser() user: ReqUser, @Body() fileDto: SalesFileDto){
        return this.saleService.importFile(user, fileDto);
    }

    @Post('add')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    @FormDataRequest()
    addSale(@GetUser() user: ReqUser, @Body() saleDto: SaleDto){
        return this.saleService.addSale(user, saleDto);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    get(@GetUser() user: ReqUser){
        return this.saleService.get(user);
    }

    @Get()
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    getAll(@GetUser() user: ReqUser){
        return this.saleService.getAll(user);
    }
}
