import { IsNotEmpty } from "class-validator";

export class ConnectDto{
    @IsNotEmpty()
    access_token: string
}