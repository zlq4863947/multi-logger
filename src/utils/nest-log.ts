import { Logger as NestLogger } from '@nestjs/common';

export function nestLog(fn: (data: any, event?: string) => void, data: any, event?: string): void {
  const logFn = fn.bind(NestLogger);
  if (typeof data === 'object') {
    logFn(JSON.stringify(data), event);

    return;
  }
  logFn(data, event);
}
