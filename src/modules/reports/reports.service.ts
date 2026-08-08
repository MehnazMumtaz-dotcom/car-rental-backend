import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: number) {
    const now = dayjs();
    const last7 = now.subtract(7, 'day');
    const prev7 = now.subtract(14, 'day');

    const currentBookings = await this.prisma.booking.findMany({
      where: { companyId, createdAt: { gte: last7.toDate() } },
    });

    const prevBookings = await this.prisma.booking.findMany({
      where: {
        companyId,
        createdAt: { gte: prev7.toDate(), lt: last7.toDate() },
      },
    });

    const currentComplaints = await this.prisma.complaint.findMany({
      where: { companyId, createdAt: { gte: last7.toDate() } },
    });

    const prevComplaints = await this.prisma.complaint.findMany({
      where: {
        companyId,
        createdAt: { gte: prev7.toDate(), lt: last7.toDate() },
      },
    });

    const calc = (curr, prev) => {
  const percent = prev > 0 ? ((curr - prev) / prev) * 100 : 0;

  return {
    value: Math.round(curr),
    last7Days: Math.round(prev),
    percentage: Math.round(percent),
    trend: percent >= 0 ? 'up' : 'down',
  };
};
    
const prevResolvedComplaints = await this.prisma.complaint.count({
  where: {
    companyId,
    status: 'RESOLVED',
    createdAt: { gte: prev7.toDate(), lt: last7.toDate() },
  },
});

const currentResolvedComplaints = await this.prisma.complaint.count({
  where: {
    companyId,
    status: 'RESOLVED',
    createdAt: { gte: last7.toDate() },
  },
});

const currRate =
  currentComplaints.length === 0
    ? 0
    : (currentResolvedComplaints / currentComplaints.length) * 100;

const prevRate =
  prevComplaints.length === 0
    ? 0
    : (prevResolvedComplaints / prevComplaints.length) * 100;
const resolutionStats = calc(currRate, prevRate);
    const currRevenue = currentBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );

    const prevRevenue = prevBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0,
    );


    return {
  bookings: calc(currentBookings.length, prevBookings.length),
  complaints: calc(currentComplaints.length, prevComplaints.length),
  revenue: calc(currRevenue, prevRevenue),
  resolutionRate: resolutionStats,
};
  }

async getBookingTrend(companyId: number, type: string) {
  const now = dayjs();

  let startDate;

  if (type === "monthly") {
    startDate = now.subtract(30, "day");
  } else {
    startDate = now.subtract(7, "day");
  }

  const bookings = await this.prisma.booking.findMany({
    where: {
      companyId,
      createdAt: {
        gte: startDate.toDate(),
      },
    },
    select: {
      createdAt: true,
    },
  });

  const map = {};

  bookings.forEach((b) => {
    let key;

    if (type === "monthly") {
      key = dayjs(b.createdAt).format("MMM");
    } else {
      key = dayjs(b.createdAt).format("DD MMM");
    }

    map[key] = (map[key] || 0) + 1;
  });

  return Object.keys(map).map((key) => ({
    label: key,
    value: map[key],
  }));
}
async getRevenueByCity(companyId: number, type: string) {
  const now = dayjs();

  let startDate;

  if (type === "monthly") {
    startDate = now.startOf("month");
  } else {
    startDate = now.subtract(7, "day");
  }

  const bookings = await this.prisma.booking.findMany({
    where: {
      companyId,
      startDate: {
        gte: startDate.toDate(),
      },
    },
  });

  const grouped: Record<string, number> = {};

  bookings.forEach((b) => {
    const city = b.city || "Unknown";

    grouped[city] =
      (grouped[city] || 0) + (b.totalPrice || 0);
  });

  const result = Object.entries(grouped).map(
    ([city, revenue]) => ({
      city,
      revenue,
    }),
  );

  return result;
}
 async getComplaintSummary(companyId: number) {
  const data = await this.prisma.complaint.groupBy({
    by: ['status'],
    where: { companyId },
    _count: true,
  });

  const total = data.reduce(
    (sum, item) => sum + item._count,
    0,
  );

  return data.map((item) => ({
    status: item.status,
    count: item._count,
    percentage: total
      ? Number(((item._count / total) * 100).toFixed(2))
      : 0,
  }));
}
}