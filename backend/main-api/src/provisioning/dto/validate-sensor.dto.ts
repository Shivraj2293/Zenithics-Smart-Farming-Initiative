// src/provisioning/dto/validate-sensor.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateSensorDto {
  @IsString()
  @IsNotEmpty()
  sensorId: string;
}