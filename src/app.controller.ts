import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'ok',
      message: '🚀 Car Rental Backend is live now!',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'healthy' };
  }
}