// src/weather/weather.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeatherService } from './weather.service';

@Controller('weather')
@UseGuards(AuthGuard('jwt'))
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('forecast')
  getForecast(@Query('lat') lat: number, @Query('lon') lon: number) {
    return this.weatherService.getForecast(lat, lon);
  }
}