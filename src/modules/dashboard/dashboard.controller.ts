import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('dashboard')
@UseGuards(AuthGuard, PermissionsGuard)
@RequirePermission('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Request() req) {
    return this.dashboardService.getStats(req.user.companyId);
  }

  @Get('booking-trend')
  getBookingTrend(@Query('type') type: 'week' | 'month', @Request() req) {
    return this.dashboardService.getBookingTrend(req.user.companyId, type);
  }

  @Get('complaint-summary')
  getComplaintSummary(@Request() req) {
    return this.dashboardService.getComplaintSummary(req.user.companyId);
  }

  @Get('revenue-trend')
  getRevenueTrend(@Query('type') type: 'week' | 'month', @Request() req) {
    return this.dashboardService.getRevenueTrend(req.user.companyId, type);
  }

  @Get('recent-complaints')
  getRecentComplaints(@Request() req) {
    return this.dashboardService.getRecentComplaints(req.user.companyId);
  }

  @Get('sla-alerts')
  getSlaAlerts(@Request() req) {
    return this.dashboardService.getSlaAlerts(req.user.companyId);
  }
}