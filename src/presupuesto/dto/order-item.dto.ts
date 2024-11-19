import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class OrderItemDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    productId?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    serviceId?: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsPositive()
    price: number;
}