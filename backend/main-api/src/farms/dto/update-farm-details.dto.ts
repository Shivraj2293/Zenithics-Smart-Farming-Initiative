// src/farms/dto/update-farm-details.dto.ts

import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateFarmDetailsDto {
  @IsString()
  @IsOptional()
  cropType?: string;

  @IsDateString()
  @IsOptional()
  plantingDate?: Date;

  @IsNumber()
  @IsOptional()
  landArea?: number;

  @IsString()
  @IsOptional()
  irrigationSource?: string;

  @IsNumber()
  @IsOptional()
  pumpHorsepower?: number;
}