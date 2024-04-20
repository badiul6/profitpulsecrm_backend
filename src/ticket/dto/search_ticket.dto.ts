import { IsNotEmpty } from "class-validator";

export class SearchTicketDto{

    @IsNotEmpty()
    ticket_no:string
}
