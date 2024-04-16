import { IsEmail } from "class-validator"

export class CreateDealDto{

    @IsEmail()
    contact_email:string

    @IsEmail()
    agent_email:string

}
