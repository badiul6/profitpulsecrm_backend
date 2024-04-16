import { IsEmail, IsString } from "class-validator"

export class AddInteractionDto{

    @IsEmail()
    contact_email:string

    @IsString()
    interaction_msg:string

}
