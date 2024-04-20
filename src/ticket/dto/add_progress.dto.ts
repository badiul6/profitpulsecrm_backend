import { IsNotEmpty } from "class-validator";

export class AddProgressDto{

    @IsNotEmpty()
    ticket_no:string

    @IsNotEmpty()
    progress: string
}
