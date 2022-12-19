import { DynamicModule, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as dotenv from 'dotenv';

import { ApiConfigService } from './c-services/api-config.service';

import { LoggerMiddleware } from './middlewares/logger.mw';

// Make an array of all external dependency which will be exported from common module
const providers = [ApiConfigService, LoggerMiddleware];

@Global()
export class CommonModule {
  static forRoot(): DynamicModule {
    // Take Node environment from script and decide which file to look for environment variables.
    dotenv.config({ path: `./env/${process.env.NODE_ENV}.env` });

    return {
      module: CommonModule,
      imports: [WinstonModule.forRoot(LoggerMiddleware.loggerOptions())],
      providers,
      exports: [...providers],
    };
  }
}
