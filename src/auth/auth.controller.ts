import { Body, Controller, Get, HttpCode, Param, Post, Redirect, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ForgotPasswordDto, ReqUser } from './dto';
import { LocalAuthGuard } from './guard';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

 /**
 * @api {post} auth/signup User Signup
 * @apiDescription Allows users to sign up for the application.
 *
 * @apiParam {String} fullname User's name.
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password (must be strong).
 * @apiParam {String[]} roles Array of user roles (e.g., ["OWNER", "SAGENT"]).
 *
 * @apiSuccess {number} Status Code: 201
 * @apiSuccessExample {json} 
 *     {
 *       "fullname": "John doe",
 *       "email": "john.doe@gmail.com",
 *       "password": "StrongPassword#123",
 *       "roles": ["ADMIN", "CSAGENT","MAGENT"]
 *     }
 */
    @Post('signup')
    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    } 
 /**
 * @api {post} auth/login User Login
 * @apiDescription Allows users to Login for the application.
 *
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {number} Status Code: 200
 * @apiSuccessExample {json} 
 *     {
 *       "email": "john.doe@gmail.com",
 *       "password": "StrongPassword#123",
 *     }
 */
    @Post('/login')
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    login(@GetUser() user: ReqUser){
      return this.authService.signin(user);
    }

/**
 * @api {get} auth/logout User Logout
 * @apiDescription Allows users to Logout from the application.
 *
 * @apiParam {sid} Session Id in the cookie.
 *
 * @apiSuccess {number} Status Code: 200
 */
    @Get('/logout')
    logout(@Request() user:any) {
      return this.authService.signout(user);
    }

    @Get('/verify/:code')
    @Redirect('',302)
    verify(@Param('code') code:string) {
      return this.authService.verify(code);
    }
    
    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto){
      return this.authService.forgotPassword(dto);
    }

   
}
