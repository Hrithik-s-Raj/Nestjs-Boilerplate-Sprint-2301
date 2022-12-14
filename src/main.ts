import { NestFactory } from '@nestjs/core';
import { ApiConfigService } from './common/c-services/api-config.service';
import { CommonModule } from './common/common.module';
import { AppModule } from './core/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = ApiConfigService.appConfig().port;

  await app.listen(port, async () => {
    console.log(`App listning on port ${port}`);
  });
}
bootstrap();
