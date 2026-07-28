import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';


@Injectable()
export class AuditLogsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async createLog(data:{
    adminId:number;
    action:string;
    entity:string;
    entityId:number;
    meta?:any;
  }) {

    return this.prisma.auditLog.create({
      data:{
        adminId:data.adminId,
        action:data.action,
        entity:data.entity,
        entityId:data.entityId,
        meta:data.meta,
      },
    });

  }

  async findAll(companyId: number){

    const logs =
      await this.prisma.auditLog.findMany({

        where: {
          admin: {
            companyId,
          },
        },

        orderBy:{
          createdAt:"desc",
        },

        include:{
          admin:{
            select:{
              id:true,
              name:true,
              email:true,
            },
          },
        },

      });

    return Promise.all(

      logs.map(async(log)=>{

        let targetAdmin: {
          id:number;
          name:string;
          email:string;
        } | null = null;

        if(log.entity === "ADMIN"){

          // Security fix: target admin bhi sirf usi company ka hona chahiye
          targetAdmin =
            await this.prisma.admin.findFirst({
              where:{
                id:log.entityId,
                companyId,
              },
              select:{
                id:true,
                name:true,
                email:true,
              },
            });

        }

        return {
          ...log,
          targetAdmin,
        };

      })

    );

  }

}