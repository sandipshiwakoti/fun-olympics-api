import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserService } from 'src/user/user.service';
import TransformInterceptor from '../interceptors/transform.interceptor';
import {
  LoginResponseDTO,
  RegisterDTO,
  RegistrationDTO,
  RequestRegistrationDTO,
  VerifyRegistrationDTO,
} from './auth.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { ResetPasswordDTO } from 'src/user/user.dto';
import { Role } from 'src/role.enum';
import { Roles } from 'src/roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseInterceptors(TransformInterceptor('Successfully logged in!'))
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<LoginResponseDTO> {
    return this.authService.login(req.user);
  }

  @UseInterceptors(TransformInterceptor('OTP sent to email and mobile!'))
  @Public()
  @Post('request-registration')
  async requestRegistration(
    @Body()
    user: RequestRegistrationDTO,
  ) {
    return this.userService.requestRegistration(user);
  }

  @UseInterceptors(TransformInterceptor('Successfully verified your account!'))
  @Public()
  @Post('verify-registration')
  async verifyRegistration(@Body() user: VerifyRegistrationDTO) {
    return this.userService.verifyRegistration(user);
  }

  @UseInterceptors(
    TransformInterceptor('Successfully registered your account!'),
  )
  @Public()
  @Post('registration')
  async registration(
    @Body()
    user: RegistrationDTO,
  ) {
    return this.userService.registration(user);
  }

  @UseInterceptors(
    TransformInterceptor(
      'Successfully created account! You can now login to your account after verification!',
    ),
  )
  @Public()
  @Post('register')
  async register(
    @Body()
    user: RegisterDTO,
  ) {
    return this.userService.createUserAccount(user);
  }

  @Roles(Role.Admin)
  @UseInterceptors(TransformInterceptor('Successfully updated user password!'))
  @Put('reset-password')
  resetUserPassword(
    @Body() resetPasswordPayload: ResetPasswordDTO,
  ): Promise<UserEntity> {
    return this.userService.resetUserPassword(resetPasswordPayload);
  }
}
