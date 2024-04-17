import { IsEmail } from "class-validator"

export class CancelledDealDto{

    @IsEmail()
    contact_email:string

}
