// src/modules/orden-fabricacion/dto/patch-adjunto.dto.ts
import { IsString } from 'class-validator';

export class PatchAdjuntoDto {
  @IsString()
  adjunto!: string; // URL devuelta por el storage
}