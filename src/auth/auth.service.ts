import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JWTPayloadDTO, LoginResponseDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<JWTPayloadDTO> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user?.registeredAt) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatched) {
      const { password, registerToken, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  async login(user: UserEntity): Promise<LoginResponseDTO> {
    const payload = {
      name: user.name,
      img: user.img,
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
