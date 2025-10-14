// src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required to access the endpoint (e.g., [Role.Admin])
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If an endpoint has no @Roles() decorator, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user object that the AuthGuard attached to the request
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role is included in the list of required roles
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}