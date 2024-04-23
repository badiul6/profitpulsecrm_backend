import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class SendEmailDto{
    @IsNotEmpty()
    @IsArray()
    @IsEmail({},{each:true})
    to: string[]

    @IsOptional()
    @IsArray()
    @IsEmail({},{each:true})
    cc: string[]
    
    @IsOptional()
    @IsArray()
    @IsEmail({},{each:true})
    bcc: string[]

    @IsNotEmpty()
    @IsString()
    body: string

    @IsOptional()
    subject:string
    
}
