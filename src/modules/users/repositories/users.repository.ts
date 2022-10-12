import { Injectable } from '@nestjs/common';
import { ConflictError } from 'src/common/errors/types/ConflictError';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { hashPassword } from '../utils/hashPassword.utils';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.findByEmail(createUserDto.email);
    if (userByEmail) throw new ConflictError('Email already exists');

    const userByUsername = await this.findByUsername(createUserDto.username);
    if (userByUsername) throw new ConflictError('Username already exists');

    const hashedPassword = await hashPassword(createUserDto.password);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.prisma.user.create({ data: userData });
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError('Resource not found');

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Resource not found');

    const hashedPassword = await hashPassword(updateUserDto.password);
    const userData = {
      ...updateUserDto,
      password: hashedPassword,
    };

    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }
}
