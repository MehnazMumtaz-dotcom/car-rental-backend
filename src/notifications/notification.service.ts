import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class NotificationService {

  constructor(private prisma: PrismaService) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendEscalationAlert(count: number, companyId: number) {

    const message = `${count} complaints have been escalated due to SLA breach`;

    await this.prisma.notification.create({
      data: {
        title: 'SLA Escalation Alert',
        message,
        type: 'ESCALATION',
        companyId: companyId,
      },
    });

    try {
      await this.transporter.sendMail({
        from: `"Admin Panel" <${process.env.SMTP_EMAIL}>`,
        to: process.env.SMTP_EMAIL,
        subject: '🚨 Complaint Escalation Alert',
        text: message,
      });
      console.log('📩 Notification saved + email sent');
    } catch (error) {
      console.error('❌ Escalation email failed:', error);
      // Email fail ho to bhi notification database mein already save ho chuki hai,
      // is liye poori escalation process crash nahi hogi
    }
  }

  async getNotifications(companyId: number, adminId: number) {

    const notifications = await this.prisma.notification.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      createdAt: n.createdAt,
      read: n.readBy.includes(adminId),
    }));

  }

  async markAsRead(notificationId: number, adminId: number, companyId: number) {

    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, companyId },
    });

    if (!notification) {
      throw new BadRequestException('Notification not found');
    }

    if (!notification.readBy.includes(adminId)) {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readBy: { push: adminId } },
      });
    }

    return { message: 'Notification marked as read' };

  }

  async markAllAsRead(companyId: number, adminId: number) {

    const unread = await this.prisma.notification.findMany({
      where: {
        companyId,
        NOT: { readBy: { has: adminId } },
      },
    });

    await this.prisma.$transaction(
      unread.map((n) =>
        this.prisma.notification.update({
          where: { id: n.id },
          data: { readBy: { push: adminId } },
        }),
      ),
    );

    return { message: 'All notifications marked as read' };

  }

}