import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';


export class UpdateEstadoDto {
  @IsInt()
  id: number;

  
}