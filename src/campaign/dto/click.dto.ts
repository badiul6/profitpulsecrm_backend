import { IsEmail, IsNotEmpty, IsUrl } from "class-validator";

export class ClickDto{
    @IsNotEmpty()
    campaign:string
    
    @IsUrl()
    url:string

    @IsEmail()
    email:string
}