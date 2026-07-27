import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

 @Get('booking-trend')
getBookingTrend(@Query('type') type: 'week' | 'month') {
  return this.dashboardService.getBookingTrend(type);
}

  @Get('complaint-summary')
  getComplaintSummary() {
    return this.dashboardService.getComplaintSummary();
  }

@Get('revenue-trend')
getRevenueTrend(@Query('type') type: 'week' | 'month') {
  return this.dashboardService.getRevenueTrend(type);
}

  @Get('recent-complaints')
  getRecentComplaints() {
    return this.dashboardService.getRecentComplaints();
  }

  @Get('sla-alerts')
  getSlaAlerts() {
    return this.dashboardService.getSlaAlerts();
  }
}