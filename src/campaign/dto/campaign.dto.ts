import { IsNotEmpty } from "class-validator";

export class CampaignDto{
    
    @IsNotEmpty()
    name: string
}