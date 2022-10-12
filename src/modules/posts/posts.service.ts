import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  create(createPostDto: CreatePostDto, user: any) {
    return this.postsRepository.create(createPostDto, user);
  }

  findAll(skip: number, take: number) {
    return this.postsRepository.findAll(skip, take);
  }

  findById(id: string) {
    return this.postsRepository.findById(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: string) {
    return this.postsRepository.remove(id);
  }
}
