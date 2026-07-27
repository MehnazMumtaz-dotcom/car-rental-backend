import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class NotificationService {

  constructor(private prisma: PrismaService) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password',
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

    console.log('📩 Notification saved + email sent');

    await this.transporter.sendMail({
      from: 'your-email@gmail.com',
      to: 'admin@gmail.com',
      subject: '🚨 Complaint Escalation Alert',
      text: message,
    });
    console.log('📩 Notification saved + email sent');
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

  async markAsRead(notificationId: number, adminId: number) {

    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
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