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



  // ✅ CREATE ADMIN
  async create(
    dto:any,
    currentUser:any,
  ) {


    const exists = await this.prisma.admin.findUnique({
      where:{
        email:dto.email,
      },
    });


    if(exists){
      throw new BadRequestException(
        'Email already exists'
      );
    }



    const hashedPassword =
      await bcrypt.hash(dto.password,10);



    const admin =
      await this.prisma.admin.create({

        data:{
          name:dto.name,
          email:dto.email,
          password:hashedPassword,
          companyId:dto.companyId,
         
          role:dto.role,
          permissions:dto.permissions ?? [],
        },

      });



    const {password,...result}=admin;



    await this.auditLogs.createLog({

      adminId:currentUser.sub,

      action:'CREATE',

      entity:'ADMIN',

      entityId:admin.id,

      meta:{
        createdAdmin:admin.name,
        email:admin.email,
      },

    });



    return result;

  }





  // ✅ GET ALL ADMINS
  findAll(){

    return this.prisma.admin.findMany({

      select:{

        id:true,
        name:true,
        email:true,
        role:true,
        status:true,
        permissions:true,
        companyId:true,
      
        lastLogin:true,
        createdAt:true,
        updatedAt:true,
        company:true,

      },

    });

  }





  // ✅ GET ONE ADMIN
  async findOne(id:number){


    const admin =
      await this.prisma.admin.findUnique({

        where:{
          id,
        },

        select:{

          id:true,
          name:true,
          email:true,
          role:true,
          status:true,
          permissions:true,
          companyId:true,
         
          lastLogin:true,
          createdAt:true,
          updatedAt:true,
          company:true,

        },

      });



    if(!admin){
      throw new NotFoundException(
        'Admin not found'
      );
    }


    return admin;

  }






  // ✅ UPDATE ADMIN
  async update(
    id:number,
    dto:any,
    currentUser:any,
  ){


    const existingAdmin =
      await this.prisma.admin.findUnique({

        where:{
          id,
        },

      });



    if(!existingAdmin){

      throw new NotFoundException(
        'Admin not found'
      );

    }



    let data:any={
      ...dto,
    };



    if(dto.password){

      data.password =
        await bcrypt.hash(
          dto.password,
          10
        );

    }




    const admin =
      await this.prisma.admin.update({

        where:{
          id,
        },

        data,

      });





    await this.auditLogs.createLog({

      adminId:currentUser.sub,

      action:'UPDATE',

      entity:'ADMIN',

      entityId:id,

      meta:{

        updatedAdmin:admin.name,

        changes:dto,

      },

    });




    const {password,...result}=admin;


    return result;

  }







  // ✅ DELETE ADMIN
  async remove(
    id:number,
    currentUser:any,
  ){


    const exists =
      await this.prisma.admin.findUnique({

        where:{
          id,
        },

      });



    if(!exists){

      throw new NotFoundException(
        'Admin not found'
      );

    }




    await this.auditLogs.createLog({

      adminId:currentUser.sub,

      action:'DELETE',

      entity:'ADMIN',

      entityId:id,

      meta:{

        deletedAdmin:exists.name,

      },

    });




    const admin =
      await this.prisma.admin.delete({

        where:{
          id,
        },

      });



    const {password,...result}=admin;


    return result;

  }


}