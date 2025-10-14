// src/farms/farms.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { Farm, FarmStatus } from './entities/farm.entity';
import { User, Role } from '../users/entities/user.entity';
import { UpdateFarmDetailsDto } from './dto/update-farm-details.dto';
import { FarmInsight } from './entities/farm-insight.entity';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(FarmInsight)
    private readonly insightRepository: Repository<FarmInsight>,
    @Inject(DataSource)
    private dataSource: DataSource,
  ) {}

  create(createFarmDto: CreateFarmDto, owner: User): Promise<Farm> {
    const farm = this.farmRepository.create({ ...createFarmDto, owner });
    return this.farmRepository.save(farm);
  }

  findAllForUser(user: User): Promise<Farm[]> {
    if (user.role === Role.Admin) {
      return this.farmRepository.find({ relations: ['owner'] });
    }
    return this.farmRepository.find({ where: { owner: { id: user.id } } });
  }

  async findOne(farmId: string, user: User) {
    const farm = await this.farmRepository.findOne({ where: { id: farmId }, relations: ['owner', 'sensor'] });
    if (!farm || (user.role !== Role.Admin && farm.owner?.id !== user.id)) {
      throw new NotFoundException(`Farm with ID ${farmId} not found`);
    }
    return farm;
  }

  async updateDetails(farmId: string, dto: UpdateFarmDetailsDto, user: User) {
    const farm = await this.findOne(farmId, user);
    Object.assign(farm, dto);
    return this.farmRepository.save(farm);
  }
  
  async getInsights(farmId: string, user: User) {
    await this.findOne(farmId, user);
    return this.insightRepository.find({ where: { farm: { id: farmId } }, order: { createdAt: 'DESC' } });
  }

  async getSensorData(farmId: string, user: User) {
    const farm = await this.findOne(farmId, user); // Authorization check
    if (!farm.sensor) {
      return [];
    }
    const sensorId = farm.sensor.sensorId;

    // --- THIS IS THE CORRECTED QUERY ---
    // It now selects the average for all four required data points.
    const query = `
      SELECT
        time_bucket('1 hour', time) AS hour,
        AVG(air_temperature) as avg_air_temp,
        AVG(air_humidity) as avg_air_humidity,
        AVG(soil_moisture) as avg_soil_moisture,
        AVG(soil_temperature) as avg_soil_temp
      FROM sensor_data
      WHERE sensor_id = $1 AND time > NOW() - INTERVAL '24 hours'
      GROUP BY hour
      ORDER BY hour;
    `;
    
    return this.dataSource.query(query, [sensorId]);
  }


  // --- THIS IS THE NEW METHOD THAT WAS MISSING ---
  async getLatestSensorData(farmId: string, user: User) {
    const farm = await this.findOne(farmId, user);
    if (!farm.sensor) return null;
    const sensorId = farm.sensor.sensorId;
    
    const result = await this.dataSource.query(`
      SELECT * FROM sensor_data
      WHERE sensor_id = $1
      ORDER BY time DESC
      LIMIT 1;
    `, [sensorId]);
    return result[0] || null;
  }
}