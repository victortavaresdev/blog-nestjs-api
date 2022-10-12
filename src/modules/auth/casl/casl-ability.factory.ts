import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PostEntity } from 'src/modules/posts/entities/post.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export enum Action {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof UserEntity | typeof PostEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(authenticatedUser: User, id: string) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (authenticatedUser.id === id) {
      can(Action.Update, UserEntity);
      can(Action.Read, UserEntity);
      can(Action.Update, PostEntity);
      can(Action.Delete, PostEntity);
    } else {
      cannot(Action.Update, UserEntity);
      cannot(Action.Read, UserEntity);
      cannot(Action.Update, PostEntity);
      cannot(Action.Delete, PostEntity);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
