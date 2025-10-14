// src/admin/admin.controller.ts

import { Body, Controller, Get, Delete, UseGuards, Param, Patch, Header, Query, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guards';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { CompleteFarmSetupDto } from './dto/complete-farm-setup.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';


@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @Roles(Role.Admin)
  getPlatformStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('users')
  @Roles(Role.Admin)
  @Header('Cache-Control', 'no-store')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/approve')
  @Roles(Role.Admin)
  approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('users/:id/role')
  @Roles(Role.Admin)
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, updateUserRoleDto);
  }

  @Get('farms')
  @Roles(Role.Admin)
  getAllFarms(@Query('sortBy') sortBy: string, @Query('order') order: string) {
    return this.adminService.getAllFarms(sortBy, order);
  }

  // --- THIS IS THE ENDPOINT THAT NEEDS TO BE CORRECT ---
  @Patch('farms/:id/complete-setup')
  @Roles(Role.Admin)
  completeFarmSetup(
    @Param('id') id: string,
    @Body() completeFarmSetupDto: CompleteFarmSetupDto,
  ) {
    return this.adminService.completeFarmSetup(id, completeFarmSetupDto);
  }
  
  @Patch('sensors/:id')
  @Roles(Role.Admin)
  updateSensor(
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    return this.adminService.updateSensor(id, updateSensorDto);
  }

  @Get('sensors')
  @Roles(Role.Admin)
  getSensors() {
    return this.adminService.getSensors();
  }

  @Delete('sensors/:id')
  @Roles(Role.Admin)
  deleteSensor(@Param('id') id: string) {
    return this.adminService.deleteSensor(id);
  }

  // Add this new endpoint inside the AdminController class
  @Delete('users/:id')
  @Roles(Role.Admin)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Add this new endpoint inside the AdminController class
  @Delete('farms/:id')
  @Roles(Role.Admin)
  deleteFarm(@Param('id') id: string) {
    return this.adminService.deleteFarm(id);
  }
}