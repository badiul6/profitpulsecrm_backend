import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class ResetAgentPasswordDto{
    @IsEmail()
    agent_email: string 
}