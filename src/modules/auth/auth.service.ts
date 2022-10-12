import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/repositories/users.repository';

const BadRequestProps = {
  code: 'BAD_REQUEST',
  message: 'Invalid credentials',
  status: HttpStatus.BAD_REQUEST,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new BadRequestException(BadRequestProps);

    const plainPassword = await bcrypt.compare(pass, user.password);
    if (!plainPassword) throw new BadRequestException(BadRequestProps);

    const { password, createdAt, ...data } = user;

    return data;
  }

  async login(user: any) {
    const { username, email, id } = user;

    const payload = {
      username,
      email,
      sub: id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
