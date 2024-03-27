import { IsNotEmpty, IsString } from "class-validator";

export class RenameTemplateDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    newname: string
}
