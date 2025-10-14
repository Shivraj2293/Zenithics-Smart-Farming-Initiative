// src/provisioning/provisioning.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class ProvisioningService {
  constructor(private dataSource: DataSource) {}


    async validateDevice(sensorId: string): Promise<{ isValid: boolean }> {
    const sensor = await this.dataSource.query(
      `SELECT id FROM sensors WHERE "sensorId" = $1`, [sensorId]
    );
    // If we find a sensor with that ID, it's valid.
    return { isValid: sensor.length > 0 };
  }

  async registerDevice(macAddress: string): Promise<{ sensorId: string }> {
    // Check if a sensor with this MAC address already exists
    let sensor = await this.dataSource.query(
      `SELECT "sensorId" FROM sensors WHERE "macAddress" = $1`, [macAddress]
    );

    if (sensor.length > 0) {
      // If it exists, return the existing sensorId
      return { sensorId: sensor[0].sensorId };
    } else {
      // If it's a new device, create a new sensor entry
      const newSensorId = `device-${randomBytes(4).toString('hex')}`; // e.g., device-a1b2c3d4
      await this.dataSource.query(
        `INSERT INTO sensors (id, "sensorId", name, type, "macAddress") VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [newSensorId, `New Device (${macAddress})`, 'Default', macAddress]
      );
      return { sensorId: newSensorId };
    }
    
  }
}