import { IsOptional, IsString } from "class-validator";

export class BuscarInsumosDto {

    @IsString()
    @IsOptional()
    tipoInsumo?: string;

    @IsString()
    @IsOptional()
    categoria?: string;

    @IsString()
    @IsOptional()
    termino?: string;
}