import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @Length(5, 50)
  @IsString()
  title: string;

  @IsNotEmpty()
  @Length(50, 1000)
  @IsString()
  content: string;
}
