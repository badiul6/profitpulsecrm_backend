import { IsNotEmpty } from "class-validator";

export class ConnectGmailDto{
    @IsNotEmpty()
    authorization_code: string

}