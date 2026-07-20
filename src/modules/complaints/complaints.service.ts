import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import {
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
} from '@prisma/client';
@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // CREATE COMPLAINT
  // =========================
async create(
  data: CreateComplaintDto,
  adminId: number,
) {

  const booking = await this.prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }


  if (booking.companyId !== data.companyId) {
    throw new BadRequestException('Company mismatch');
  }


  // =========================
  // AUTO CATEGORY DETECTION
  // =========================

  let category: ComplaintCategory = ComplaintCategory.OTHER;

  const text = data.description.toLowerCase();


  if (
    text.includes('payment') ||
    text.includes('charge') ||
    text.includes('bill') ||
    text.includes('refund')
  ) {
    category = ComplaintCategory.BILLING;
  }

  else if (
    text.includes('car') ||
    text.includes('vehicle') ||
    text.includes('damage') ||
    text.includes('engine')
  ) {
    category = ComplaintCategory.VEHICLE_ISSUE;
  }

  else if (
    text.includes('driver') ||
    text.includes('rude') ||
    text.includes('behavior')
  ) {
    category = ComplaintCategory.DRIVER_BEHAVIOR;
  }

  else if (
    text.includes('booking') ||
    text.includes('cancel') ||
    text.includes('reservation')
  ) {
    category = ComplaintCategory.BOOKING_ERROR;
  }


  // =========================
  // SLA LOGIC
  // =========================

  let slaDays = 14;

  if (data.priority === ComplaintPriority.URGENT) {
    slaDays = 7;
  }


  const slaDeadline = new Date(
    Date.now() + slaDays * 24 * 60 * 60 * 1000,
  );


  // =========================
  // CREATE COMPLAINT
  // =========================
console.log("ADMIN ID SAVING:", adminId);
  return this.prisma.complaint.create({
  data: {
    ...data,
    category,
    companyId: data.companyId,
    createdById: adminId,
    status: ComplaintStatus.OPEN,
    slaDeadline,
  },

  include: {
  booking: true,
  company: true,
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
}
});
}
  // =========================
  // ASSIGN COMPLAINT
  // =========================

  async assignComplaint(id: number, adminId: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    // ✅ admin check
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // ✅ company match (MULTI-TENANT SAFETY)
    if (admin.companyId !== complaint.companyId) {
      throw new BadRequestException(
        'Admin does not belong to this company',
      );
    }

    return this.prisma.complaint.update({
      where: { id },

      data: {
        assignedToId: adminId,
       status: ComplaintStatus.IN_PROGRESS,
      },

      include: {
        assignedTo: true,
      },
    });
  }

  // =========================
  // RESOLVE COMPLAINT
  // =========================

  async resolveComplaint(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return this.prisma.complaint.update({
      where: { id },

      data: {
       status: ComplaintStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });
  }

  // =========================
  // GET ALL + FILTERS
  // =========================

  async getAll(filters?: {
    status?: string;
    priority?: string;
    companyId?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    return this.prisma.complaint.findMany({
      where,

      include: {
        booking: true,
        company: true,
        createdBy: true,
        assignedTo: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
    // =========================
  // DELETE COMPLAINT
  // =========================

  async deleteComplaint(id: number) {

    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return this.prisma.complaint.delete({
      where: { id },
    });
  }
}