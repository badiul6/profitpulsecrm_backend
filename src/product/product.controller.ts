import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { ProductService } from './product.service';
import { ReqUser } from 'src/auth/dto';
import { ProductDto } from './dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post('add')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SHEAD)
    add(@GetUser() user:ReqUser, @Body() productDto:ProductDto){
        return this.productService.add(user, productDto);
    }
}
