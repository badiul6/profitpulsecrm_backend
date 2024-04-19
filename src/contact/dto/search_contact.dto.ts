import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchContactDto{
    @IsEmail()
    email: string

}
