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

  async create(data: CreateComplaintDto, adminId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.companyId !== data.companyId) {
      throw new BadRequestException('Company mismatch');
    }
    const text = data.description?.toLowerCase() || '';
let category: ComplaintCategory =
  data.category ?? ComplaintCategory.OTHER;

if (!data.category) {
  if (
    text.includes('payment') ||
    text.includes('charge') ||
    text.includes('bill') ||
    text.includes('refund')
  ) {
    category = ComplaintCategory.BILLING;
  } else if (
    text.includes('car') ||
    text.includes('vehicle') ||
    text.includes('damage') ||
    text.includes('engine')
  ) {
    category = ComplaintCategory.VEHICLE_ISSUE;
  } else if (
    text.includes('driver') ||
    text.includes('rude') ||
    text.includes('behavior')
  ) {
    category = ComplaintCategory.DRIVER_BEHAVIOR;
  } else if (
    text.includes('booking') ||
    text.includes('cancel') ||
    text.includes('reservation')
  ) {
    category = ComplaintCategory.BOOKING_ERROR;
  }
}

let priority: ComplaintPriority =
 data.priority ?? ComplaintPriority.STANDARD;

if (!data.priority) {
  if (text.includes('urgent') || text.includes('immediately')) {
    priority = ComplaintPriority.URGENT;
  }
}

let slaDays = 14;

if (priority === ComplaintPriority.URGENT) {
  slaDays = 7;
}

const slaDeadline = new Date(
  Date.now() + slaDays * 24 * 60 * 60 * 1000,
);
    const complaint = await this.prisma.complaint.create({
    data: {
  ...data,
  category,
  priority, 
  createdById: adminId,
  status: ComplaintStatus.OPEN,
  slaDeadline,
},
    });

    await this.prisma.notification.create({
      data: {
        title: 'New Complaint Created',
        message: `Complaint #${complaint.id} has been created`,
        type: 'COMPLAINT',
        companyId: complaint.companyId,
      },
    });

    return complaint;
  }

async assignComplaint(id: number, adminId: number) {

  const complaint = await this.prisma.complaint.findUnique({
    where: { id },
  });

  if (!complaint) {
    throw new NotFoundException('Complaint not found');
  }


  const admin = await this.prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
  throw new NotFoundException('Admin not found');
}


if (admin.companyId !== complaint.companyId) {
  throw new BadRequestException('Company mismatch');
}


const updated = await this.prisma.complaint.update({

  where: { id },

  data: {
    assignedToId: adminId,
    status: ComplaintStatus.IN_PROGRESS,
  },

  include: {
    assignedTo: true,
  },

});

await this.prisma.notification.create({
  data: {
    title: 'Complaint Assigned',
    message: `Complaint #${id} assigned to admin ${admin.name}`,
    type: 'COMPLAINT',
    companyId: complaint.companyId,
  },
});


return updated;

}
  async resolveComplaint(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }
      if (!complaint.assignedToId) {
    throw new BadRequestException('Assign complaint first');
  }
if (complaint.status === ComplaintStatus.RESOLVED) {
  throw new BadRequestException('Already resolved');
}
    const updated = await this.prisma.complaint.update({
      where: { id },
      data: {
        status: ComplaintStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });

    await this.prisma.notification.create({
      data: {
        title: 'Complaint Resolved',
        message: `Complaint #${id} has been resolved`,
        type: 'COMPLAINT',
        companyId: complaint.companyId,
      },
    });

    return updated;
  }
  async getAll(filters?: {
    status?: string;
    priority?: string;
    companyId?: number;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.companyId) where.companyId = filters.companyId;

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
  async deleteComplaint(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }
     if (complaint.status === ComplaintStatus.RESOLVED) {
    throw new BadRequestException('Already closed');
  }

  return this.prisma.complaint.update({
  where: { id },
  data: {
   status: ComplaintStatus.RESOLVED
  },
});
   
  }
}