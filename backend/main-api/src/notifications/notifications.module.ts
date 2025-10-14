import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
// We are removing the import from here
import { NotificationsService } from './notifications.service';

@Module({
  providers: [
    NotificationsService,
    {
      provide: 'MAILER_TRANSPORTER',
      useFactory: (configService: ConfigService) => {
        // --- THIS IS THE FIX ---
        // We 'require' the library here instead of importing it at the top
        const sendgridTransport = require('nodemailer-sendgrid-transport');
        
        const options = {
          auth: {
            api_key: configService.get<string>('SENDGRID_API_KEY'),
          },
        };
        // Now, 'sendgridTransport' is correctly identified as a function
        return nodemailer.createTransport(sendgridTransport(options));
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
