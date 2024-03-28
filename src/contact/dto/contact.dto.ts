import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ContactDto{
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    fullname: string

    @IsNotEmpty()
    phone:string

    @IsOptional()
    companyname:string;

    @IsOptional()
    jobtitle:string;

}
