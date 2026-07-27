import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { ComplaintStatus } from '@prisma/client';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class ComplaintsScheduler {

  private readonly logger = new Logger(ComplaintsScheduler.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  @Cron('0 */5 * * * *')
  async checkOverdueComplaints() {

    const now = new Date();

    try {

      const overdueComplaints = await this.prisma.complaint.findMany({
        where: {
          slaDeadline: { lt: now },
          status: {
            in: [
              ComplaintStatus.OPEN,
              ComplaintStatus.IN_PROGRESS,
            ],
          },
          escalated: false,
        },
      });

      const result = await this.prisma.complaint.updateMany({

        where: {

          slaDeadline: {
            lt: now,
          },

          status: {
            in: [
              ComplaintStatus.OPEN,
              ComplaintStatus.IN_PROGRESS,
            ],
          },

          escalated: false,
        },

        data: {

          escalated: true,
          escalatedAt: now,
          status: ComplaintStatus.ESCALATED,

        },

      });

      if (result.count === 0) {

        this.logger.log(
          `No SLA breaches found at ${now.toISOString()}`
        );

        return;
      }

      this.logger.warn(
        `Escalated ${result.count} complaints`
      );

      const count = result.count;
      const companyId = overdueComplaints[0].companyId;

      await this.notificationService.sendEscalationAlert(
        count,
        companyId,
      );

    } catch (error) {

      this.logger.error(
        'Error in SLA scheduler',
        error.stack
      );

    }
  }
}