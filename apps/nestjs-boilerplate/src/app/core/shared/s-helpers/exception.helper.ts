import { HttpException } from '@nestjs/common';
import * as ErrorStackParser from 'error-stack-parser';

export const stackTrace = (exception: HttpException): string => {
  const errorstack = ErrorStackParser.parse(exception)[0];
  const errorsrc = errorstack.fileName.split('\\').pop();
  const errorlocation = `${errorsrc}(line:${errorstack.lineNumber}, column:${errorstack.columnNumber})`;
  return errorlocation;
};
