import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async createConfig(data: any) {
    const existing = await this.prisma.config.findUnique({
      where: { companyId: data.companyId },
    });

    if (existing) {
      throw new BadRequestException(
        'Config already exists for this company',
      );
    }

    return this.prisma.config.create({
      data,
    });
  }

  async getConfig(companyId: number) {
    let config = await this.prisma.config.findUnique({
      where: { companyId },
        include:{
      company:true
    }
    });
  
   if (!config) {
  throw new NotFoundException('Config not found');
}

    return config;
  }
  async getAllConfigs() {
    return this.prisma.config.findMany({
      include: { company: true },
    });
  }

  async updateConfig(companyId: number, data: any) {
    const existing = await this.prisma.config.findUnique({
      where: { companyId },
    });

    if (!existing) {
      throw new NotFoundException('Config not found');
    }

    if (data.commissionType === 'FLAT') {
      data.percentage = null;
      data.hybridFlat = null;
      data.hybridPercentage = null;
    }

    if (data.commissionType === 'PERCENTAGE') {
      data.flatAmount = null;
      data.hybridFlat = null;
      data.hybridPercentage = null;
    }

    if (data.commissionType === 'HYBRID') {
      data.flatAmount = null;
      data.percentage = null;
    }

    return this.prisma.config.update({
      where: { companyId },
      data,
    });
  }

  async patchConfig(companyId: number, data: any) {
    const existing = await this.prisma.config.findUnique({
      where: { companyId },
    });

    if (!existing) {
      throw new NotFoundException('Config not found');
    }

    const updatedData = {
      ...existing,
      ...data,
    };

    if (updatedData.commissionType === 'FLAT') {
      updatedData.percentage = null;
      updatedData.hybridFlat = null;
      updatedData.hybridPercentage = null;
    }

    if (updatedData.commissionType === 'PERCENTAGE') {
      updatedData.flatAmount = null;
      updatedData.hybridFlat = null;
      updatedData.hybridPercentage = null;
    }

    if (updatedData.commissionType === 'HYBRID') {
      updatedData.flatAmount = null;
      updatedData.percentage = null;
    }

    return this.prisma.config.update({
      where: { companyId },
      data: updatedData,
    });
  }

  async deleteConfig(companyId: number) {
    const existing = await this.prisma.config.findUnique({
      where: { companyId },
    });

    if (!existing) {
      throw new NotFoundException('Config not found');
    }

    return this.prisma.config.delete({
      where: { companyId },
    });
  }
}