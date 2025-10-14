import { Controller, Post, Body, UnauthorizedException, Param} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }


  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
      return this.authService.forgotPassword(email);
    }

  @Post('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body('password') password: string) {
      return this.authService.resetPassword(token, password);
    }
}