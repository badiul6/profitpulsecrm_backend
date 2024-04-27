import { IsEmail, IsString } from "class-validator"

export class AssignAgentDto{

    @IsEmail()
    contact_email:string

    @IsEmail()
    agent_email:string

    @IsString()
    campaign_name:string

}
