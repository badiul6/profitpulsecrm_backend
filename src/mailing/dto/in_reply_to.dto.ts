import { IsArray, IsEmail, IsNotEmpty } from "class-validator";

export class InReplyToDto{
    @IsNotEmpty()
    @IsArray()
    @IsEmail({},{each:true})
    to: string[]
    
    @IsNotEmpty()
    body: string

    @IsNotEmpty()
    subject:string

    @IsNotEmpty()
    thread_id:string
}
