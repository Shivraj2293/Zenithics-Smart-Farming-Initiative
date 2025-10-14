// src/farms/entities/farm.entity.ts

import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { FarmInsight } from './farm-insight.entity'; // Import the new entity
import { Sensor } from '../../sensors/sensor.entity';

export enum FarmStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.farms, { onDelete: 'CASCADE' })
  owner: User;

  // New columns for farm details
  @Column({ name: 'cropType', nullable: true })
  cropType: string;

  @Column({ name: 'plantingDate', type: 'date', nullable: true })
  plantingDate: Date;

  @Column({ name: 'landArea', type: 'double precision', nullable: true })
  landArea: number;

  @Column({ name: 'irrigationSource', nullable: true })
  irrigationSource: string;

  @Column({ name: 'pumpHorsepower', type: 'double precision', nullable: true })
  pumpHorsepower: number;

  @Column({ name: 'sensorId', nullable: true, unique: true })
  sensorId: string;

  // New relationship to insights
  @OneToMany(() => FarmInsight, (insight) => insight.farm, { cascade: true })
  insights: FarmInsight[];

  @OneToOne(() => Sensor, sensor => sensor.farm)
  @JoinColumn({ name: 'sensorId' }) // Specify the foreign key column
  sensor: Sensor;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: FarmStatus,
    default: FarmStatus.PENDING,
  })
  status:FarmStatus;
}