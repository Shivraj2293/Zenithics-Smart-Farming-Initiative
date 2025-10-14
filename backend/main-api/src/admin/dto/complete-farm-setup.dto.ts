// src/admin/dto/complete-farm-setup.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteFarmSetupDto {
  @IsString()
  @IsNotEmpty()
  sensorId: string;
}