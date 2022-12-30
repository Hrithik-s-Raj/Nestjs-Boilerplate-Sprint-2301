import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import * as WinstonDailyRotate from 'winston-daily-rotate-file';
import * as path from 'path';
import {
  WINSTON_MODULE_PROVIDER,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { Logger, transports, format, createLogger } from 'winston';
import { Request, Response } from 'express';

import { ApiConfigService } from '../c-services/api-config.service';
import { SuccessLog } from '../../core/shared/s-interfaces/log-format.interface';
import { MongoDB, MongoDBConnectionOptions } from 'winston-mongodb';

const baseLogPath = path.resolve(__dirname, '../../../logs');
// Logger level
const customLoggerLevel = {
  crit: 0,
  error: 1,
  warn: 2,
  notice: 3,
  debug: 4,
  info: 5,
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  static options: any;
  static dbinfo;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: () => void) {
    next();
    const start = new Date().valueOf();
    res.once('finish', () => {
      const statusCode: number = res.statusCode;
      const environment = ApiConfigService.appConfig().env;
      const responsetime = new Date().valueOf() - start;
      const logFormat: SuccessLog = {
        method: req.method,
        response_time: responsetime + ' ms',
        environment: environment,
        request_url: req.originalUrl,
        IP: req.ip,
        response_code: statusCode,
        params: req.params,
        query: req.query,
        body: req.body,
      };
      if (statusCode <= 399) {
        this.logger.debug(LoggerMiddleware.name, logFormat);
      }
    });
  }

  public static loggerOptions() {
    const options = {
      levels: customLoggerLevel,
      exitOnError: false,
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Nest'),
          ),
        }),

        new WinstonDailyRotate({
          filename: `${baseLogPath}/errors/error.%DATE%.log`,
          datePattern: 'YYYYMMDD',
          json: true,
          maxSize: '1m',
          level: 'warn',
        }),

        new MongoDB({
          level: 'warn',
          metaKey: 'metadata',
          db: 'mongodb+srv://winston:winston@8943921454@cluster0.vwz7hxx.mongodb.net/?retryWrites=true&w=majority',
          name: 'mongodb',
          collection: 'log-error',
          decolorize: true,
          tryReconnect: true,
          storeHost: true,
          options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          },
        }),

        new MongoDB({
          level: 'debug',
          metaKey: 'metadata',
          db: 'mongodb+srv://winston:winston@8943921454@cluster0.vwz7hxx.mongodb.net/?retryWrites=true&w=majority',
          name: 'mongodb',
          collection: 'log-debug',
          decolorize: true,
          tryReconnect: true,
          storeHost: true,
          options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          },
        }),
        new WinstonDailyRotate({
          filename: `${baseLogPath}/combined/app-combined.%DATE%.log`,
          datePattern: 'YYYYMMDD',
          json: true,
          maxSize: '1m',
          level: 'debug',
        }),
      ],
    };
    return options;
  }
}
