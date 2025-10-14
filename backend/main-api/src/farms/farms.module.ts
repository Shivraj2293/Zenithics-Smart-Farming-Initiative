import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { Farm } from './entities/farm.entity';
import { FarmInsight } from './entities/farm-insight.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Farm, FarmInsight])],
  controllers: [FarmsController],
  providers: [FarmsService],
})
export class FarmsModule {}