import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity'; // <-- Add this import
import { randomBytes } from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService, 
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    // First, check if the password is correct
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // THEN, check if the user has been approved
      if (!user.isApproved && user.role !== Role.Admin) {
        // If not approved (and not an admin), throw a specific error
        throw new ForbiddenException('Your account is pending admin approval.');
      }
      const { passwordHash, ...result } = user;
      return result;
    }
    // If password or user is incorrect, return null
    return null;
  }

  async login(user: any) {
    // The 'user' object here comes from your validateUser method and contains the role.
    // We need to add it to the payload.
    const payload = { email: user.email, sub: user.id, role: user.role }; // <-- FIX IS HERE

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User with that email does not exist.');
    }

    // Generate a secure, random token
    const resetToken = randomBytes(32).toString('hex');

    // Save the hashed token and its expiry date to the user's record
    user.passwordResetToken = resetToken; // In production, hash this token
    user.passwordResetExpires = new Date(Date.now() + 3600000); // Token is valid for 1 hour
    await this.usersService.save(user); // You'll need to create this simple save method in UsersService

    // Send the email
    await this.notificationsService.sendPasswordResetLink(user.email, resetToken);
    return { message: 'Password reset link has been sent to your email.' };
  }

  async resetPassword(token: string, newPassword: string) {
  const user = await this.usersService.findOneByResetToken(token);
  
  // --- THIS IS THE CORRECTED LINE ---
  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    throw new NotFoundException('Password reset token is invalid or has expired.');
  }

  // Hash the new password and update the user
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await this.usersService.save(user);

  return { message: 'Password has been reset successfully.' };
}
}
