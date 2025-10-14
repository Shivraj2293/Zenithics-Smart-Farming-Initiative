// src/provisioning/provisioning.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ProvisioningService } from './provisioning.service';

@Controller('provisioning')
export class ProvisioningController {
  constructor(private readonly provisioningService: ProvisioningService) {}

  @Post('register')
  async registerDevice(@Body('macAddress') macAddress: string) {
    return this.provisioningService.registerDevice(macAddress);
  }

  @Post('validate')
  async validateDevice(@Body('sensorId') sensorId: string) {
    return this.provisioningService.validateDevice(sensorId);
  }
}