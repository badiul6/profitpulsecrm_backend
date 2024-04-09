import { IsArray, IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class MarketingEmailsDto{
    @IsNotEmpty()
    @IsArray()
    @IsEmail({},{each:true})
    mailing_list: string[]

    @IsNotEmpty()
    @IsString()
    html_template: string

    @IsNotEmpty()
    @IsString()
    subject:string

    @IsNotEmpty()
    campaign_name:string

    @IsUrl()
    url:string
}
