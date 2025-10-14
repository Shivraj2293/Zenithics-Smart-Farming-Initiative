// src/farms/farms.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDetailsDto } from './dto/update-farm-details.dto';

@Controller('farms')
@UseGuards(AuthGuard('jwt'))
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    return this.farmsService.create(createFarmDto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.farmsService.findAllForUser(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.farmsService.findOne(id, req.user);
  }

  @Patch(':id/details')
  updateDetails(@Param('id') id: string, @Body() dto: UpdateFarmDetailsDto, @Req() req) {
    return this.farmsService.updateDetails(id, dto, req.user);
  }
  
  @Get(':id/insights')
  getInsights(@Param('id') id: string, @Req() req) {
    return this.farmsService.getInsights(id, req.user);
  }

  @Get(':id/sensordata')
  getSensorData(@Param('id') id: string, @Req() req) {
    return this.farmsService.getSensorData(id, req.user);
  }

  // --- THIS IS THE NEW ENDPOINT THAT WAS MISSING ---
  @Get(':id/sensordata/latest')
  getLatestSensorData(@Param('id') id: string, @Req() req) {
    return this.farmsService.getLatestSensorData(id, req.user);
  }
}