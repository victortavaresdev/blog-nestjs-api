import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConflictInterceptor } from './common/errors/interceptors/Conflict.interceptor';
import { ForbiddenInterceptor } from './common/errors/interceptors/Forbidden.interceptor';
import { NotFoundInterceptor } from './common/errors/interceptors/NotFound.interceptor';
import { swaggerConfig } from './config/swagger/swagger.config';
import { validationConfig } from './config/validation/validation.config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  swaggerConfig(app);
  validationConfig(app);

  app.useGlobalInterceptors(new NotFoundInterceptor());
  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new ForbiddenInterceptor());

  app.use(helmet());
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
};
bootstrap();
