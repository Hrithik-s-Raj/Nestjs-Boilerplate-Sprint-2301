import {
  Inject,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import * as helper from '../../core/shared/s-helpers/exception.helper';
import { ErrorLog } from '../../core/shared/s-interfaces/log-format.interface';
import { ApiConfigService } from '../c-services/api-config.service';

@Catch()
export class HttpCatchException implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const environment = ApiConfigService.appConfig().env;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorlocation = helper.stackTrace(exception);
    const logFormat: ErrorLog = {
      environment: environment,
      context: HttpException.name,
      error_path: errorlocation,
      error_message: exception.message,
      method: request.method,
      request_url: request.originalUrl,
      IP: request.ip,
      response_code: statusCode,
      params: request.params,
      query: request.query,
      body: request.body,
    };

    if (statusCode >= 500) {
      this.logger.error(logFormat);
    } else if (statusCode >= 400) {
      this.logger.warn(logFormat);
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      requestUrl: request.url,
      message: exception.message,
    });
  }
}
