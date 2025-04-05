import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateComponenteInsumoDto {
    @IsNumber()
    @Type(() => Number)
    insumoId: number;

    @IsNumber()
    @Type(() => Number)
    cantidad: number;

}