import { IsEmail, IsEnum, IsNotEmpty } from "class-validator"
import { Role } from "src/auth/schema"

export class UserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string 

    @IsNotEmpty()
    fullname: string

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role
}