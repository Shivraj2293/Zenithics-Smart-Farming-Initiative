// src/farms/entities/farm-insight.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Farm } from './farm.entity';

export enum InsightCategory {
  IRRIGATION = 'IRRIGATION',
  DISEASE_ALERT = 'DISEASE_ALERT',
  PEST_ALERT = 'PEST_ALERT',
  FERTILIZER_TIMING = 'FERTILIZER_TIMING',
}

export enum InsightStatus {
  ACTIVE = 'active',
  DISMISSED = 'dismissed',
}

@Entity('farm_insights')
export class FarmInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Farm, (farm) => farm.insights)
  farm: Farm;

  @Column({
    name: 'insightType',
    type: 'enum',
    enum: InsightCategory,
  })
  insightType: InsightCategory;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: InsightStatus,
    default: InsightStatus.ACTIVE,
  })
  status: InsightStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}