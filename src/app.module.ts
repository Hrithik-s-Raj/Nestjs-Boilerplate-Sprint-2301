import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nest-status-monitor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    StatusMonitorModule.setUp({
      pageTitle: 'Perfomance Monitoring Page',
      port: 3000,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
