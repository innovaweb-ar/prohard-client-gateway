import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateInsumoDto {

    @IsString()
    public name: string;

    @IsNumber({
        maxDecimalPlaces:5
    })
    @Min(0)
    @Type(() => Number)
    public price: number;

    @IsString()
    public category: string;      // Categoría del insumo (e.g., memoria, disco, fuente)

    @IsString()
    public subcategory: string;   // Subcategoría del insumo (e.g., RAM, SSD, PSU)

    @IsString()
    public code: string;          // Código del insumo

    @IsString()
    public description: string;   // Descripción del insumo

    @IsString()
    public condition: string;     // Estado del insumo (nuevo, usado)

    @IsNumber({
        maxDecimalPlaces:5
    })
    @Min(0)
    @Type(() => Number)
    public costPrice: number;     // Precio de costo

}
