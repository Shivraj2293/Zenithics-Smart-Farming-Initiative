// src/admin/dto/update-user-role.dto.ts
import { IsEnum } from 'class-validator';
import { Role } from '../../users/entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(Role)
  role: Role;
}