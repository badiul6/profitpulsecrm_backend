import { IsNotEmpty } from "class-validator";

export class ReadMsgDto{

    @IsNotEmpty()
    msg_id:string
    
}
