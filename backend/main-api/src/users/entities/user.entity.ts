// src/users/entities/user.entity.ts

import { Farm } from '../../farms/entities/farm.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum Role {
  Admin = 'admin',
  Farmer = 'farmer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'passwordHash' })
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Farmer,
  })
  role: Role;

  @Column({ name: 'isApproved', default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ name: 'passwordResetToken', type: 'text', nullable: true })
  passwordResetToken: string | null;

  @Column({ name: 'passwordResetExpires', type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  @OneToMany(() => Farm, (farm) => farm.owner, { cascade: true })
  farms: Farm[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}