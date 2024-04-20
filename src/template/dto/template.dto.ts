import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Data } from "../schema";

export class TemplateDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    thumbnail: string
    
    @IsObject()
    data:Data
}
