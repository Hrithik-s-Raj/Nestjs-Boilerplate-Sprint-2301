import { CacheModule, Global, Module } from '@nestjs/common';
import { ApiConfigService } from './c-services/api-config.service';

// create an array that will provide all service from c-service module
const providers = [ApiConfigService];

@Global()
@Module({
  imports: [],
  providers,
  exports: [...providers],
})
export class CommonModule {}
