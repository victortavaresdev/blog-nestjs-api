import { User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
