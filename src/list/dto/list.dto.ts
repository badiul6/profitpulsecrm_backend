import { IsArray, IsEmail, IsNotEmpty } from "class-validator"

export class ListDto{

    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsArray()
    @IsEmail({},{each:true})
    mailing_list:string[]

}
