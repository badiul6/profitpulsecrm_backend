import { IsNotEmpty, IsString } from "class-validator";

export class SearchTemplateDto{
    @IsNotEmpty()
    @IsString()
    name: string
}
