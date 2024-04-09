import { IsDecimal, IsNotEmpty, IsOptional} from "class-validator";

export class UpdateProductDto{

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    new_name: string

    @IsOptional()
    description: string

    @IsDecimal()    
    quantity:number

    @IsDecimal()
    unit_price:number

}
