// src/admin/dto/update-sensor.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateSensorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;
}