import { IsEmail, IsNotEmpty } from "class-validator"
import { Role } from "src/auth/schema"

export class UserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string 

    @IsNotEmpty()
    fullname: string

    @IsNotEmpty()
    role: Role
}