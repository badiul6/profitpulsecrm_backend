import { IsEmail, IsNotEmpty, IsUrl } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class CompanyDto{
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    contact: string

    @IsNotEmpty()
    @IsUrl()
    website_link:string
    
    @IsNotEmpty()
    address: string
    
    @IsUrl()
    @IsNotEmpty()
    social_link: string

    @IsFile()
    @MaxFileSize(1e6)
    @HasMimeType(['image/jpeg','image/png'])
    logo: MemoryStoredFile
}