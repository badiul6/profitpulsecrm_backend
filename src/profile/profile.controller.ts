import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { GetUser, Roles } from 'src/auth/decorator';
import { ReqUser } from 'src/auth/dto';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guard';
import { CompanyDto, ResetAgentPasswordDto, UpdatePasswordDto, UpdateUserDto, UserDto } from './dto';
import { ProfileService } from './profile.service';
import { Role } from 'src/auth/schema';

@Controller('profile')
export class ProfileController {
    constructor( private profileService: ProfileService){}

    @Post('complete')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.OWNER)
    @FormDataRequest()
    createCompany(@GetUser() user: ReqUser,@Body() companydto: CompanyDto)
    {
        return this.profileService.createCompany(user, companydto);
    }

    @Post('adduser')
    @UseGuards(AuthenticatedGuard,RolesGuard)
    @Roles(Role.OWNER)
    addUser(@GetUser() user: ReqUser, @Body() userdto: UserDto){
        return this.profileService.addUsers(user, userdto);
        
    }

    @Patch('updateuser')
    @UseGuards(AuthenticatedGuard)
    updateUser(@GetUser() user: ReqUser,@Body() userdto: UpdateUserDto){
        return this.profileService.updateUser(user, userdto);
    }

    @Patch('updatepassword')
    @UseGuards(AuthenticatedGuard)
    updatePassword(@GetUser() user: ReqUser, @Body() passwordDto: UpdatePasswordDto){
        return this.profileService.updatePassword(user, passwordDto);
    }
    @Patch('resetagentpassword')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.OWNER)
    resetAgentPassword(@Body() dto: ResetAgentPasswordDto){
        return this.profileService.resetAgentPassword(dto);
    }

    @Get('viewusers')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.OWNER)
    viewUsers(@GetUser() user: ReqUser){
        return this.profileService.viewUsers(user);
    }
    
    @Delete('deleteuser/:email')
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Roles(Role.OWNER)
    deleteUser(@Param('email') email:string, @GetUser() user:ReqUser){
        return this.profileService.deleteuser(email, user);
    }


    @Get('viewprofile')
    @UseGuards(AuthenticatedGuard)
    viewProfile(@GetUser() user: ReqUser){
        return this.profileService.viewProfile(user);
    }
    
    
    

}
