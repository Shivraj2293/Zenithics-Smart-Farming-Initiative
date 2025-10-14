// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CompleteFarmSetupDto } from './dto/complete-farm-setup.dto';
import { FarmStatus } from '../farms/entities/farm.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { NotificationsService } from '../notifications/notifications.service'; // Import





@Injectable()
export class AdminService {
  constructor(
    private dataSource: DataSource,
    private notificationsService: NotificationsService, // Inject
  ) {}

  async getPlatformStats() {
    // Query for total number of farmers
    const farmerCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM users WHERE role = 'farmer'`,
    );
    const totalFarmers = parseInt(farmerCountResult[0].count, 10);

    // Query for total number of farms
    const farmCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM farms`,
    );
    const totalFarms = parseInt(farmCountResult[0].count, 10);
    
    // Query for total number of connected sensors/devices
    // We count the distinct sensor_ids that have sent data in the last 24 hours
    const deviceCountResult = await this.dataSource.query(
        `SELECT COUNT(DISTINCT sensor_id) FROM sensor_data WHERE time > NOW() - INTERVAL '24 hours'`,
    );
    const activeDevices = parseInt(deviceCountResult[0].count, 10);

    return {
      totalFarmers,
      totalFarms,
      activeDevices,
    };
  }

  // Add this method inside the AdminService class
    async getAllFarms(sortBy = 'createdAt', order = 'DESC') {
      // Whitelist allowed columns for sorting to prevent SQL injection
      const allowedSortBy = ['name', 'createdAt', 'cropType', 'status'];
      const safeSortBy = allowedSortBy.includes(sortBy) ? `f."${sortBy}"` : 'f."createdAt"';
      
      // Whitelist allowed order directions
      const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const query = `
        SELECT
          f.id,
          f.name,
          f.status,
          f."cropType",
          f."createdAt",
          u."fullName" as "ownerName"
        FROM farms f
        LEFT JOIN users u ON f."ownerId" = u.id
        ORDER BY ${safeSortBy} ${safeOrder};
      `;
      return this.dataSource.query(query);
    }




  async getAllUsers() {
    // This advanced SQL query uses JSON_AGG to group all of a user's farms
    // into a JSON array directly. This is very efficient.
    const query = `
      SELECT
        u.id,
        u."fullName",
        u.email,
        u."isApproved",
        u."createdAt",
        COALESCE(
          json_agg(
            json_build_object('id', f.id, 'name', f.name, 'status', f.status)
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'::json
        ) as farms
      FROM users u
      LEFT JOIN farms f ON u.id = f."ownerId"
      WHERE u.role = 'farmer'
      GROUP BY u.id
      ORDER BY u."createdAt" DESC;
    `;
    return this.dataSource.query(query);
  }

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { role } = updateUserRoleDto;
    await this.dataSource.query(
      `UPDATE users SET role = $1 WHERE id = $2`,
      [role, userId]
    );
    return { message: 'User role updated successfully.' };
  }

  async approveUser(userId: string) {
    // Step 1: Find the user to get their email
    const userResult = await this.dataSource.query(
      `SELECT email FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.length === 0) {
      // In a real app, you'd throw a NotFoundException here
      console.error(`Attempted to approve non-existent user with ID: ${userId}`);
      return;
    }
    const userEmail = userResult[0].email;

    // Step 2: Update the user's status in the database
    await this.dataSource.query(
      `UPDATE users SET "isApproved" = TRUE WHERE id = $1`,
      [userId]
    );

    // Step 3: Send the activation email
    await this.notificationsService.sendAccountActivationEmail(userEmail);

    return { message: 'User approved successfully and notification sent.' };
  }


  async completeFarmSetup(farmId: string, completeFarmSetupDto: CompleteFarmSetupDto) {
    const { sensorId } = completeFarmSetupDto; // This is the UUID of the sensor

    // This is the only query we need. It updates the farm to link to the sensor
    // and sets its status to 'active'.
    await this.dataSource.query(
      `UPDATE farms SET "sensorId" = $1, status = $2 WHERE id = $3`,
      [sensorId, FarmStatus.ACTIVE, farmId]
    );

    // The incorrect query that tried to update the 'sensors' table has been removed.

    return { message: 'Farm setup completed and status set to active.' };
  }

  async updateSensor(sensorId: string, updateSensorDto: UpdateSensorDto) {
    const { name, type } = updateSensorDto;
    // This query only updates the fields that are provided
    await this.dataSource.query(
      `UPDATE sensors SET name = COALESCE($1, name), type = COALESCE($2, type) WHERE id = $3`,
      [name, type, sensorId]
    );
    return { message: 'Sensor updated successfully.' };
  }



  async deleteSensor(sensorId: string) {
    // First, we need to unlink the farm from the sensor
    await this.dataSource.query(
      `UPDATE farms SET "sensorId" = NULL WHERE "sensorId" = $1`,
      [sensorId]
    );
    // Then, delete the sensor itself
    await this.dataSource.query(
      `DELETE FROM sensors WHERE id = $1`,
      [sensorId]
    );
    return { message: 'Sensor deleted successfully.' };
  }

  async deleteUser(userId: string) {
    // The database's "ON DELETE CASCADE" will handle deleting associated farms
    await this.dataSource.query(
      `DELETE FROM users WHERE id = $1`,
      [userId]
    );
    return { message: 'User and all associated data deleted successfully.' };
  }

  async deleteFarm(farmId: string) {
    await this.dataSource.query(
      `DELETE FROM farms WHERE id = $1`,
      [farmId]
    );
    return { message: 'Farm deleted successfully.' };
  }

  async getSensors() {
    return this.dataSource.query(`SELECT * FROM sensors ORDER BY "createdAt" DESC`);
  }
}