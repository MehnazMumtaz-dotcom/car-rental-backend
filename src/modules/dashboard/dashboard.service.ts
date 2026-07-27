import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

async getStats() {
  const now = new Date();
  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 7);

  const prev7DaysStart = new Date(now);
  prev7DaysStart.setDate(now.getDate() - 14);

  const prev7DaysEnd = new Date(now);
  prev7DaysEnd.setDate(now.getDate() - 7);

  const [currentBookings, prevBookings] = await Promise.all([
    this.prisma.booking.count({
      where: {
        status: 'ACTIVE',
        createdAt: { gte: last7Days },
      },
    }),
    this.prisma.booking.count({
      where: {
        status: 'ACTIVE',
        createdAt: {
          gte: prev7DaysStart,
          lt: prev7DaysEnd,
        },
      },
    }),
  ]);

  const [currentComplaints, prevComplaints] = await Promise.all([
    this.prisma.complaint.count({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        createdAt: { gte: last7Days },
      },
    }),
    this.prisma.complaint.count({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        createdAt: {
          gte: prev7DaysStart,
          lt: prev7DaysEnd,
        },
      },
    }),
  ]);

  const [currentRevenue, prevRevenue] = await Promise.all([
    this.prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { gte: last7Days },
      },
    }),
    this.prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: {
          gte: prev7DaysStart,
          lt: prev7DaysEnd,
        },
      },
    }),
  ]);

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  return {
    activeBookings: {
      value: currentBookings,
      percentage: calcGrowth(currentBookings, prevBookings),
    },

    openComplaints: {
      value: currentComplaints,
      percentage: calcGrowth(currentComplaints, prevComplaints),
    },

    totalRevenue: {
      value: currentRevenue._sum.totalPrice || 0,
      percentage: calcGrowth(
        currentRevenue._sum.totalPrice || 0,
        prevRevenue._sum.totalPrice || 0
      ),
    },

    vendorCount: {
    value: 42,
    percentage: 0,
  },
  };
}

 async getBookingTrend(type: 'week' | 'month' = 'week') {
  const startDate = new Date();

  if (type === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const bookings = await this.prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const result = {};

  bookings.forEach((b) => {
    let key;

    if (type === 'week') {
      key = b.createdAt.toISOString().split('T')[0]; 
    } else {
      key = `${b.createdAt.getFullYear()}-${b.createdAt.getMonth() + 1}`;
    }

    result[key] = (result[key] || 0) + 1;
  });

  return Object.entries(result).map(([label, value]) => ({
    label,
    value,
  }));
}
async getComplaintSummary() {
  const complaints = await this.prisma.complaint.findMany({
    select: {
      status: true,
      slaDeadline: true,
    },
  });

  let onTrack = 0;
  let atRisk = 0;
  let breached = 0;
  let completed = 0;

  const now = new Date();

  complaints.forEach((c) => {
    if (c.status === 'RESOLVED') {
      completed++;
      return;
    }

    if (c.slaDeadline && new Date(c.slaDeadline) < now) {
      breached++;
      return;
    }

    if (c.status === 'IN_PROGRESS') {
      atRisk++;
    } else if (c.status === 'OPEN') {
      onTrack++;
    }
  });

  return {
    onTrack,
    atRisk,
    breached,
    completed,
    total: complaints.length,
  };
}
  async getRevenueTrend(type: 'week' | 'month' = 'week') {
  const startDate = new Date();

  if (type === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const bookings = await this.prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  });

  const result = {};

  bookings.forEach((b) => {
    let key;

    if (type === 'week') {
      key = b.createdAt.toISOString().split('T')[0];
    } else {
      key = `${b.createdAt.getFullYear()}-${b.createdAt.getMonth() + 1}`;
    }

    result[key] =
      (result[key] || 0) + (Number(b.totalPrice) || 0);
  });

  return Object.entries(result).map(([label, value]) => ({
    label,
    value,
  }));
}

async getRecentComplaints() {
  const complaints = await this.prisma.complaint.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
   include: {
  booking: {
    include: {
      customer: true
    }
  }
}
  });

  return complaints.map((c) => {
   let timeLeft: string | null = null;

    if (c.slaDeadline) {
      const now = new Date();
      const diff = new Date(c.slaDeadline).getTime() - now.getTime();

      if (diff > 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        timeLeft = `${minutes} mins`;
      } else {
        timeLeft = 'Expired';
      }
    }

    return {
      id: c.id,
        customer:
        c.booking?.customer?.name ||
        c.booking?.customerName ||
        'Unknown',
      category: c.category,
      timeLeft: timeLeft,
      status: c.status,
    };
  });
}
  
async getSlaAlerts() {
  const now = new Date();

  const complaints = await this.prisma.complaint.findMany({
    where: {
      slaDeadline: {
        not: null,
        lte: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      },
      status: {
        notIn: ['RESOLVED'],
      },
    },
    orderBy: {
      slaDeadline: 'asc',
    },
    include: {
      booking: {
        include: {
          customer: true,
        },
      },
    },
  });

 return complaints.map((c) => {
    let expires: string | null = null;

    if (c.slaDeadline) {
      const diffMs =
        new Date(c.slaDeadline).getTime() - now.getTime();

      const absMs = Math.abs(diffMs);

      const totalMinutes = Math.floor(absMs / (1000 * 60));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      const sign = diffMs < 0 ? '-' : '';

      expires = `${days}d ${hours}h ${minutes}m`;
    }

    return {
      id: c.id,
      customer:
        c.booking?.customer?.name ||
        c.booking?.customerName ||
        'Unknown',

      category: c.category,
      priority: c.priority,

      Expires: expires,
    };
  });
}
} 