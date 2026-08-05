import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  private getUserId(req: any): number {
    if (!req.user || !req.user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user.sub;
  }

  private getCompanyId(req: any): number {
    if (!req.user || !req.user.companyId) {
      throw new UnauthorizedException('Company context missing');
    }
    return req.user.companyId;
  }

  @Get()
  getNotifications(@Req() req: any) {
    return this.notificationService.getNotifications(
      this.getCompanyId(req),
      this.getUserId(req),
    );
  }

@Patch(':id/read')
markAsRead(@Req() req: any, @Param('id') id: string) {
  return this.notificationService.markAsRead(
    Number(id),
    this.getUserId(req),
    this.getCompanyId(req),
  );
}

  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(
      this.getCompanyId(req),
      this.getUserId(req),
    );
  }

}