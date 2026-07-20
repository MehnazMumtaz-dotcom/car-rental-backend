import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintsScheduler {

  private readonly logger = new Logger(ComplaintsScheduler.name);

  constructor(private prisma: PrismaService) {}

  // Every 5 minutes
  @Cron('0 */5 * * * *')
  async checkOverdueComplaints() {

    const now = new Date();

    try {

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

          status: ComplaintStatus.ESCALATED,

        },

      });


      if(result.count === 0){

        this.logger.log(
          'No SLA breaches found'
        );

        return;
      }


      this.logger.warn(
        `Escalated ${result.count} complaints`
      );


    } catch(error){

      this.logger.error(
        'Error in SLA scheduler',
        error.stack
      );

    }
  }
}