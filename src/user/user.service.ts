import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { CreateUserDTO, ResetPasswordDTO, UpdateUserDTO } from './user.dto';
import { generateRandomCode } from 'src/utils/helper';
import { MailService } from 'src/mail/mail.service';
import {
  RegisterDTO,
  RegistrationDTO,
  RequestRegistrationDTO,
  VerifyRegistrationDTO,
} from 'src/auth/auth.dto';
import { Role } from 'src/role.enum';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailService,
  ) {}

  // async getUsers(): Promise<UserEntity[]> {
  //   const users = await this.userRepository.find();
  //   if (!users || !users[0]) {
  //     throw new HttpException('Not found', 404);
  //   }
  //   return users;
  // }

  async getUsers(
    search: string,
    options: IPaginationOptions,
  ): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .having('u.role = :role', { role: 'user' })
      .where('u.name like :search', { search: `%${search}%` });

    return paginate<UserEntity>(queryBuilder, options);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(
    userPayload: CreateUserDTO,
    file: Express.Multer.File,
  ): Promise<Omit<UserEntity, 'password' | 'registerToken'>> {
    const user = await this.userRepository.findOneBy({
      email: userPayload.email,
    });
    if (user && user?.registeredAt) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const encryptedPassword = await bcrypt.hash(userPayload.password, 10);

    if (user?.registerToken) {
      user.registerToken = null;
      user.registeredAt = new Date();
      const updatedUser = await this.userRepository.save(user);
      const { password, registerToken, ...rest } = updatedUser; //eslint-disable-line @typescript-eslint/no-unused-vars
      return updatedUser;
    }

    if (file) {
      user.img = file.path;
    }

    const newUser: UserEntity = await this.userRepository.save({
      email: userPayload.email,
      name: userPayload.name,
      mobile: userPayload.mobile,
      country: userPayload.country,
      password: encryptedPassword,
      registerToken: null,
      registeredAt: new Date(),
      role: userPayload.role,
    });
    const { password, registerToken, ...rest } = newUser; //eslint-disable-line @typescript-eslint/no-unused-vars
    return rest;
  }

  async updateUser(
    id: number,
    userPayload: UpdateUserDTO,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    const { email, name, mobile, country } = userPayload;
    const user = await this.getUserById(id);

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    }

    const checkUserEmail = await this.userRepository.findOneBy({ email });

    if (checkUserEmail && email !== user.email) {
      throw new HttpException(
        'User email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkUserMobile = await this.userRepository.findOneBy({ mobile });

    if (checkUserMobile && mobile !== user.mobile) {
      throw new HttpException(
        'User mobile already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file) {
      user.img = file.path;
    }

    user.name = name;
    user.email = email;
    user.country = country;
    user.mobile = mobile;

    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async removeUser(id: number): Promise<UserEntity> {
    const user = await this.getUserById(id);
    const deletedUser = await this.userRepository.remove(user);
    return deletedUser;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('User does not exists!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getOwnProfile(req: any): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: req.user.id });
    if (!user) {
      throw new HttpException(
        'User profile does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getUserByRegisterToken(email: string, registerToken: string) {
    const user = await this.userRepository.findOneBy({ email, registerToken });
    return user;
  }

  async createUserAccount(
    user: RegisterDTO,
  ): Promise<Omit<UserEntity, 'password' | 'registerToken'>> {
    const checkUser: UserEntity = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (checkUser && checkUser?.registeredAt) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const token = generateRandomCode();
    await this.mailService.sendVerificationCode(user, token);
    const encryptedPassword = await bcrypt.hash(user.password, 10);

    if (checkUser?.registerToken) {
      checkUser.registerToken = token;
      const updatedUser = await this.userRepository.save(checkUser);
      const { password, registerToken, ...rest } = updatedUser; //eslint-disable-line @typescript-eslint/no-unused-vars
      return updatedUser;
    }

    const newUser: UserEntity = await this.userRepository.save({
      email: user.email,
      name: user.name,
      password: encryptedPassword,
      registerToken: token,
      role: Role.User,
    });
    const { password, registerToken, ...rest } = newUser; //eslint-disable-line @typescript-eslint/no-unused-vars
    return rest;
  }

  async requestRegistration(
    user: RequestRegistrationDTO,
  ): Promise<Omit<UserEntity, 'password' | 'registerToken'>> {
    const checkUser: UserEntity = await this.userRepository.findOne({
      where: [{ email: user.email }, { mobile: user.mobile }],
    });

    if (checkUser && checkUser?.registeredAt) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const token = generateRandomCode();

    if (checkUser?.registerToken) {
      checkUser.registerToken = token;
      const updatedUser = await this.userRepository.save(checkUser);
      await this.mailService.sendVerificationCode(user, token);
      const { password, registerToken, ...rest } = updatedUser; //eslint-disable-line @typescript-eslint/no-unused-vars
      return updatedUser;
    }

    const newUser: UserEntity = await this.userRepository.save({
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      registerToken: token,
      role: Role.User,
    });
    await this.mailService.sendVerificationCode(user, token);
    const { password, registerToken, ...rest } = newUser; //eslint-disable-line @typescript-eslint/no-unused-vars
    return rest;
  }

  async verifyRegistration(
    body: VerifyRegistrationDTO,
  ): Promise<Omit<UserEntity, 'password' | 'registerToken'>> {
    const checkUser = await this.getUserByEmail(body.email);
    if (checkUser && checkUser?.registeredAt) {
      throw new HttpException('User already exists!', 404);
    }

    const user = await this.getUserByRegisterToken(
      body.email,
      body.registerToken,
    );
    if (!user) {
      throw new HttpException('Verification code is incorrect!', 404);
    }
    const { password, registerToken, ...rest } = user;
    return rest;
  }

  async registration(
    body: RegistrationDTO,
  ): Promise<Omit<UserEntity, 'password' | 'registerToken'>> {
    const checkUser = await this.getUserByEmail(body.email);
    if (checkUser && checkUser?.registeredAt) {
      throw new HttpException('User already exists!', 404);
    }

    const user = await this.getUserByRegisterToken(
      body.email,
      body.registerToken,
    );
    if (!user) {
      throw new HttpException('Verification code is incorrect!', 404);
    }

    user.registerToken = null;
    user.registeredAt = new Date();
    user.country = body.country;
    user.password = await bcrypt.hash(body.password, 10);

    const updatedUser = await this.userRepository.save(user);
    const { password, registerToken, ...rest } = updatedUser;
    return rest;
  }

  async updateOwnProfile(
    file: Express.Multer.File,
    req: any,
  ): Promise<UserEntity> {
    const { email, name, country }: UpdateUserDTO = req.body;

    if (!email || !name || !country) {
      throw new HttpException('Fields cannot be empty', HttpStatus.BAD_REQUEST);
    }

    const user = await this.getUserById(req.user.id);
    const checkUser = await this.userRepository.findOneBy({ email });

    if (checkUser && email !== user.email) {
      throw new HttpException(
        'User email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file) {
      user.img = file.path;
    }

    user.name = name;
    user.email = email;
    user.country = country;

    const updatedUser = await this.userRepository.save(user);
    return { ...updatedUser };
  }

  async resetUserPassword(
    resetPasswordPayload: ResetPasswordDTO,
  ): Promise<UserEntity> {
    const user = await this.getUserByEmail(resetPasswordPayload.email);
    const encryptedPassword = await bcrypt.hash(
      resetPasswordPayload.password,
      10,
    );
    user.password = encryptedPassword;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
