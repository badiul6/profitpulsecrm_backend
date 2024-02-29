import { IsNotEmpty, IsStrongPassword } from "class-validator"

export class UpdatePasswordDto{
    @IsStrongPassword()
    @IsNotEmpty()
    old_password: string 
    @IsStrongPassword()
    @IsNotEmpty()
    new_password: string
}