import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { ProductService } from './product.service';
import { ReqUser } from 'src/auth/dto';
import { ProductDto, UpdateProductDto } from './dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post('add')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    add(@GetUser() user:ReqUser, @Body() productDto:ProductDto){
        return this.productService.add(user, productDto);
    }

    @Get('get')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD, Role.SAGENT, Role.CSAGENT)
    get(@GetUser() user:ReqUser){
        return this.productService.get(user);
    }
    
    @Patch('update')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    update(@GetUser() user:ReqUser, @Body() updateDto:UpdateProductDto){
        return this.productService.update(user, updateDto);
    }

    @Delete('delete/:name')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    delete(@GetUser() user:ReqUser, @Param('name') productName:string){
        return this.productService.delete(user, productName);
    }


}
