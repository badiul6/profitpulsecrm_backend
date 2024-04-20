import { IsEnum, IsNotEmpty } from "class-validator";

enum TicketStatus {
    FORWARDED = 'FORWARDED',
    RESOLVED = 'RESOLVED',
  }
export class UpdateStatusDto{

    @IsNotEmpty()
    ticket_no:string

    @IsEnum(TicketStatus)
    @IsNotEmpty()
    status: TicketStatus
}
