import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { SnapshotSkid } from '../types/snapshot-skid.type';
import { Type } from 'class-transformer';

export class UpdateOrdenFabricacionDto {
  @IsOptional() @IsString()
  estado?: string;

  @IsOptional() @IsObject()
  snapshotSkid?: SnapshotSkid | any;

  // opcional: observación de revisión
  @IsOptional()
  revisionObservacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  depositoId: number = 1; // Valor por defecto
}
