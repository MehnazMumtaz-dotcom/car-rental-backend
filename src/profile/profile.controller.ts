import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {


  constructor(
    private readonly profileService: ProfileService
  ) {}



  private getUserId(req:any):number{

    if(!req.user || !req.user.sub){

      throw new UnauthorizedException(
        'User not authenticated'
      );

    }

    return req.user.sub;

  }

  @Get()
  getAllProfiles(){

    return this.profileService.getAllProfiles();

  }

  @Get('me')
  getMyProfile(
    @Req() req:any
  ){

    return this.profileService.getProfile(
      this.getUserId(req)
    );

  }

  @Patch('update')
  updateProfile(
    @Req() req:any,
    @Body() body:any
  ){

    return this.profileService.updateProfile(
      this.getUserId(req),
      body
    );

  }

  @Post('send-otp')
  sendOtp(
    @Req() req:any
  ){

    return this.profileService.sendOtp(
      this.getUserId(req)
    );

  }

  @Post('verify-otp')
  verifyOtp(
    @Req() req:any,
    @Body('otp') otp:string
  ){

    return this.profileService.verifyOtp(
      this.getUserId(req),
      otp
    );

  }

  @Patch('change-password')
  changePassword(
    @Req() req:any,
    @Body() body:any
  ){

    return this.profileService.changePassword(

      this.getUserId(req),

      body.currentPassword,

      body.newPassword

    );

  }


  @Post('change-email')
  changeEmail(
    @Req() req:any,
    @Body('email') email:string
  ){

    return this.profileService.changeEmail(

      this.getUserId(req),

      email

    );

  }

  @Get('sessions')
  getSessions(
    @Req() req:any
  ){

    return this.profileService.getSessions(
      this.getUserId(req)
    );

  }

  @Delete('sessions/:id')
  revokeSession(
    @Req() req:any,
    @Param('id') id:string
  ){

    return this.profileService.revokeSession(

      this.getUserId(req),

      Number(id)

    );

  }

  @Delete('sessions')
  revokeAll(
    @Req() req:any
  ){

    return this.profileService.revokeAll(
      this.getUserId(req)
    );

  }

  @Get('logs')
  getLogs(
    @Req() req:any
  ){

    return this.profileService.getLogs(
      this.getUserId(req)
    );

  }


}