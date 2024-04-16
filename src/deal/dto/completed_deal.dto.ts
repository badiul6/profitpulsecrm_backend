import { Type } from "class-transformer"
import { IsDecimal, IsEmail, IsNotEmpty, IsOptional, ValidateNested } from "class-validator"


class Product{
    @IsNotEmpty()
    name:string
    
    @IsDecimal()
    quantity:number

    @IsDecimal()
    discount:number
}
export class CompletedDealDto{

    @IsEmail()
    contact_email:string
    
    @ValidateNested({ each: true }) // Validate each item in the array
    @Type(() => Product) // Ensure that each item is transformed to Pr
    @IsNotEmpty()
    products:Product[]

    @IsNotEmpty()
    sales_channel:string
    
    @IsNotEmpty()
    payment_method:string

    @IsNotEmpty()
    shipping_address:string

    @IsNotEmpty()
    billing_address:string

    @IsNotEmpty()
    location:string

    @IsDecimal()
    shipping_cost:number

    @IsOptional()
    notes:string


}
