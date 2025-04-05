import { IsEnum, IsInt, IsString } from 'class-validator';


export class UpdateEstadoDto {
  @IsInt()
  id: number;

  estado: string; // PENDIENTE, EN_PROCESO, FINALIZADA, CANCELADA
}