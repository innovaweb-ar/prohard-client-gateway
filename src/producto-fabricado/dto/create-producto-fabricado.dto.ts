import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateSckidSectionDto } from "./create-skid-section.dto";

export enum TipoProductoFabricado {
    ELECTRICO = 'ELECTRICO',
    NEUMATICO = 'NEUMATICO',
    SOLAR = 'SOLAR',
    RESERVA = 'RESERVA',
}


export class CreateProductoFabricadoDto {
    @IsString()
    nombre: string;

    @IsString()
    codigo: string;

    @IsString()
    @IsOptional()
    imagen: string;

    @Type(() => Number)
    @IsNumber()
    lts: number;

    @IsEnum(TipoProductoFabricado)
    tipo: TipoProductoFabricado;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSckidSectionDto)
    secciones: CreateSckidSectionDto[];
}
