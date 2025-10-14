import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FarmsModule } from './farms/farms.module';
import { AdminModule } from './admin/admin.module';
import { SensorsModule } from './sensors/sensors.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProvisioningModule } from './provisioning/provisioning.module'; // Import the new module

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Asynchronous TypeORM module that uses environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Should be false in production
      }),
    }),
    
    UsersModule,
    AuthModule,
    FarmsModule,
    AdminModule,
    SensorsModule,
    WeatherModule,
    NotificationsModule,
    ProvisioningModule, // Import the new module here
  ],
  controllers: [AppController], // ProvisioningController is now in its own module
  providers: [AppService],   // ProvisioningService is now in its own module
})
export class AppModule {}
