import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('verify-2fa')
  verify2FA(@Body() dto: Verify2FADto, @Req() req: any) {
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.ip || req.socket?.remoteAddress || null;

    return this.authService.verify2FA(dto.email, dto.code, userAgent, ip);
  }
}