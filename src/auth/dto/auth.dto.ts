import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator"
import { Role } from "../schema"
export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email: string 

    @IsNotEmpty()
    fullname: string

    @IsNotEmpty()
    @IsStrongPassword()
    password: string


    @IsArray()
    @IsNotEmpty()
    @IsEnum(Role, { each: true })
    roles: Role[]
}