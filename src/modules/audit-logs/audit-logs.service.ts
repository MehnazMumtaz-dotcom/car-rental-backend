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

  async findAll(){


    const logs =
      await this.prisma.auditLog.findMany({

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


          targetAdmin =
            await this.prisma.admin.findUnique({

              where:{
                id:log.entityId,
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