// src/sensors/sensor.entity.ts
import { Farm } from '../farms/entities/farm.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sensorId', unique: true })
  sensorId: string; // The device's unique ID, e.g., "weather-station-alpha"

  @Column()
  name: string; // A human-friendly name, e.g., "Main Field Weather Station"

  @Column({ nullable: true })
  type: string; // e.g., "Weather Station", "Soil Probe"

  @OneToOne(() => Farm, farm => farm.sensor)
  farm: Farm;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  // Add this property to match the database column
  @Column({ name: 'macAddress', unique: true, nullable: true })
  macAddress: string;
}