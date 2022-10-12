import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { checkAuthorization } from 'src/common/utils/checkAuthorization';
import { Action } from '../auth/casl/casl-ability.factory';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsRepository } from './repositories/posts.repository';

const apiBodyPost = {
  title: 'Teste Title',
  content: 'Teste Content Teste Content Teste Content Teste Content',
};

@ApiBearerAuth()
@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsRepository: PostsRepository,
  ) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({
    schema: {
      example: apiBodyPost,
    },
  })
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(createPostDto, req.user);
  }

  @ApiOperation({ summary: 'Get all posts by query parameter' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  findAll(@Query('skip') skip: string, @Query('take') take: string) {
    return this.postsService.findAll(+skip, +take);
  }

  @ApiOperation({ summary: 'Get post by Id' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({
    schema: {
      example: apiBodyPost,
    },
  })
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    const { authorId } = await this.postsRepository.findById(id);
    checkAuthorization(req.user, authorId, Action.Update, PostEntity);
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const { authorId } = await this.postsRepository.findById(id);
    checkAuthorization(req.user, authorId, Action.Delete, PostEntity);
    return this.postsService.remove(id);
  }
}
