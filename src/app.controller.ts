import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/guard/local-auth.guard';

@ApiTags('Auth')
@Controller('api/v1')
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({
    schema: {
      example: { email: 'teste@gmail.com', password: 'teste123' },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile information from user' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
