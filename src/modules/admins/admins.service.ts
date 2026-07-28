import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {

  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) {}

  async create(
    dto: any,
    currentUser: any,
  ) {

    if (!dto.email || !dto.password || !dto.name) {
      throw new BadRequestException('Required fields missing');
    }

    const exists = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Security fix: companyId hamesha logged-in admin ke token se lein,
    // dto se aaya companyId trust na karein (warna koi bhi admin
    // kisi doosri company mein sub-admin bana sakta hai)
    const admin = await this.prisma.admin.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        companyId: currentUser.companyId,
        role: dto.role,
        permissions: Array.isArray(dto.permissions) ? dto.permissions : [],
        profile: {
          create: {},
        },
      },
    });

    const { password, ...result } = admin;

    await this.auditLogs.createLog({
      adminId: currentUser?.sub,
      action: 'CREATE',
      entity: 'ADMIN',
      entityId: admin.id,
      meta: {
        createdAdmin: admin.name,
        email: admin.email,
      },
    });

    return result;
  }

  findAll(companyId: number) {
    return this.prisma.admin.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        permissions: true,
        companyId: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        company: true,
      },
    });
  }

  async findOne(id: number, companyId: number) {

    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    const admin = await this.prisma.admin.findFirst({
      where: {
        id,
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        permissions: true,
        companyId: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        company: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(
    id: number,
    dto: any,
    currentUser: any,
  ) {

    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    // Security fix: sirf apni company ke admin ko update karne dein
    const existingAdmin = await this.prisma.admin.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
      },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    if (dto.email && dto.email !== existingAdmin.email) {
      const emailExists = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    let data: any = {
      name: dto.name,
      email: dto.email,
      // companyId ko update karne nahi dena — warna admin khud ko
      // kisi doosri company mein move kar sakta hai
      role: dto.role,
      permissions: Array.isArray(dto.permissions) ? dto.permissions : undefined,
      status: dto.status,
    };
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const admin = await this.prisma.admin.update({
      where: {
        id,
      },
      data,
    });

    await this.auditLogs.createLog({
      adminId: currentUser?.sub,
      action: 'UPDATE',
      entity: 'ADMIN',
      entityId: id,
      meta: {
        updatedAdmin: admin.name,
        changes: dto,
      },
    });

    const { password, ...result } = admin;

    return result;
  }

  async remove(
    id: number,
    currentUser: any,
  ) {

    if (!id) {
      throw new BadRequestException('Invalid ID');
    }

    // Security fix: sirf apni company ke admin ko delete karne dein
    const exists = await this.prisma.admin.findFirst({
      where: {
        id,
        companyId: currentUser.companyId,
      },
    });

    if (!exists) {
      throw new NotFoundException('Admin not found');
    }

    const admin = await this.prisma.admin.delete({
      where: {
        id,
      },
    });

    await this.auditLogs.createLog({
      adminId: currentUser?.sub,
      action: 'DELETE',
      entity: 'ADMIN',
      entityId: id,
      meta: {
        deletedAdmin: exists.name,
      },
    });

    const { password, ...result } = admin;

    return result;
  }
}