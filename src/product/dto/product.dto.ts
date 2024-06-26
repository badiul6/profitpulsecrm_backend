import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class ProductDto{

    @IsNotEmpty()
    name: string

    @IsOptional()
    description: string

    @IsDecimal()    
    quantity:number

    @IsDecimal()
    unit_price:number

}
