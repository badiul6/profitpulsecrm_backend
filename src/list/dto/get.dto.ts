import { IsNotEmpty } from "class-validator"

export class GetDto{

    @IsNotEmpty()
    name:string

}
