import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import type { Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private mailFrom: string;
  private frontendUrl: string;

  constructor(
    @Inject('MAILER_TRANSPORTER') private readonly mailer: Transporter,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    // Load the variables from the .env file and ensure they exist
    const mailFrom = this.configService.get<string>('MAIL_FROM');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!mailFrom || !frontendUrl) {
      throw new Error('Required environment variables MAIL_FROM or FRONTEND_URL are not defined.');
    }
    
    this.mailFrom = mailFrom;
    this.frontendUrl = frontendUrl;
  }

  async sendWelcomeEmail(email: string) {
    const mailOptions = {
      from: this.mailFrom, // Use the environment variable
      to: email,
      subject: 'Welcome to Agrosphere!',
      html: `<h1>Welcome!</h1><p>Hi there,

Thank you for signing up with Agrosphere. Your account is currently pending approval from our admin team.

We'll notify you as soon as your account is activated.


The Agrosphere Team</p>`,
    };
    try {
      await this.mailer.sendMail(mailOptions);
      console.log(`---> Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  async sendPasswordResetLink(email: string, resetToken: string) {
    // Build the link dynamically using the environment variable
    const resetLink = `${this.frontendUrl}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: this.mailFrom, // Use the environment variable
      to: email,
      subject: 'Agrosphere Password Reset Request',
      html: `<p>Click this link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
    };

    try {
      await this.mailer.sendMail(mailOptions);
      console.log(`---> Password reset email sent to ${email}`);
      console.log(`---> RESET LINK (for testing): ${resetLink}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }
  }

  async sendAccountActivationEmail(email: string) {
    const loginLink = `${this.frontendUrl}/login`;
    const mailOptions = {
      from: this.mailFrom, // Use the environment variable
      to: email,
      subject: 'Your Agrosphere Account has been Activated!',
      html: `<h1>Welcome Aboard!</h1><p>Your account is now active. You can log in to your dashboard here: <a href="${loginLink}">Login</a></p>`,
    };
    try {
      await this.mailer.sendMail(mailOptions);
      console.log(`---> Account activation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send activation email:', error);
    }
  }
}

