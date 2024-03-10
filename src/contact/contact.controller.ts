import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from 'src/auth/decorator';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { Role } from 'src/auth/schema';
import { ContactService } from './contact.service';
import { ReqUser } from 'src/auth/dto';
import { ContactFileDto } from './dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService){}
    
    @Post('importfile')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.SAGENT)
    @FormDataRequest()
    importFile(@GetUser() user: ReqUser, @Body() fileDto: ContactFileDto){
        return this.contactService.importFile(user, fileDto);
    }
    // @Get('getAll')
    // @UseGuards(AuthenticatedGuard, RolesGuard)
    // @Roles(Role.SAGENT, Roles)

    

    @Post('me')
    @UseGuards(AuthenticatedGuard)
    me(@Req() req: Request){
    }
}