import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto{
    @IsNotEmpty()
    issue: string

    @IsNotEmpty()
    @IsEmail()
    contact_email: string
}
