// src/sensors/sensors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  exports: [TypeOrmModule], // Export this so other modules could use the SensorRepository
})
export class SensorsModule {}