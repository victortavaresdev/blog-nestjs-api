import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';

export interface PostProps {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, user: any): Promise<PostEntity> {
    const { id } = user;
    if (!id) throw new NotFoundError('Resource not found');

    const postData = {
      ...createPostDto,
      authorId: id,
    };

    return this.prisma.post.create({ data: postData });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundError('Resource not found');

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async findById(id: string): Promise<PostProps> {
    const post = await this.prisma.post.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
      },
    });

    if (!post) throw new NotFoundError('Resource not found');

    return post;
  }

  async findAll(page?: number): Promise<PostProps[]> {
    const limit = 5;
    const newPage = page * limit - 5;
    const selectProps = {
      id: true,
      title: true,
      content: true,
      authorId: true,
    };

    if (!page)
      return this.prisma.post.findMany({ take: limit, select: selectProps });
    else
      return this.prisma.post.findMany({
        skip: newPage,
        take: limit,
        select: selectProps,
      });
  }

  async remove(id: string): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundError('Resource not found');

    return this.prisma.post.delete({ where: { id } });
  }
}
