import { IsNotEmpty, IsString } from "class-validator";

export class TemplateDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    body: string
}
