import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatusMonitorModule } from 'nest-status-monitor';
import { ApiConfigService } from '../../common/c-services/api-config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '../../common/middlewares/logger.mw';
import { CommonModule } from '../../common/common.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${process.env.NODE_ENV}.env`,
    }),

    StatusMonitorModule.setUp({
      pageTitle: 'Perfomance Monitoring Page',
      port: ApiConfigService.appConfig().port,
      path: '/status',
      ignoreStartsWith: '/health/alive',
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      healthChecks: [],
    }),
    CommonModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
