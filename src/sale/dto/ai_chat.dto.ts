import { IsNotEmpty } from "class-validator";

export class AiChatDto{
    @IsNotEmpty()
    prompt: string

}