import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/decorators/permissions.decorator';

@Controller('reports')
@UseGuards(AuthGuard, PermissionsGuard)
@RequirePermission('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('stats')
  getStats(@Req() req) {
    return this.reportsService.getStats(req.user.companyId);
  }

 @Get('booking-trend')
getBookingTrend(
  @Req() req,
  @Query("type") type: string
) {
  return this.reportsService.getBookingTrend(
    req.user.companyId,
    type || "weekly",
  );
}

  @Get('revenue-by-vehicle')
  getRevenue(@Req() req,
  @Query("type") type: string) {
     const filterType = type || "weekly"; 
    return this.reportsService.getRevenueByVehicle(
      req.user.companyId,
        filterType 
    );
  }

  @Get('complaint-summary')
  getComplaints(@Req() req) {
    return this.reportsService.getComplaintSummary(
      req.user.companyId,
    );
  }
}