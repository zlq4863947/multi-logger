import { Logger as NestLogger } from '@nestjs/common';
import * as Log from 'log4js';
import * as moment from 'moment';

import { stringify } from './stringify';

enum LogLevel {
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'Error',
}

export enum LogCategory {
  App = 'app',
  Error = 'Error',
  Event = 'event',
}

export interface LoggerContent {
  data: any;
  event?: string;
  category?: LogCategory;
}

export class MultiLogger {
  private readonly appLogger: Log.Logger;
  private readonly eventLogger: Log.Logger;
  private readonly errorLogger: Log.Logger;

  constructor() {
    const layout = {
      type: 'messagePassThrough',
    };

    const defaultAppender = {
      type: 'multiFile',
      pattern: '.yyyy-MM-dd',
      maxLogSize: 1024 * 1024 * 50,
      backups: 300,
      compress: true,
      keepFileExt: true,
      layout,
    };

    Log.configure({
      appenders: {
        multi: { ...defaultAppender, base: 'logs/', property: 'categoryName', extension: '.log' },
      },
      categories: {
        default: { appenders: ['multi'], level: 'INFO' },
      },
    });
    this.appLogger = Log.getLogger('app');
    this.eventLogger = Log.getLogger('event');
    this.errorLogger = Log.getLogger('error');
  }

  info(content: LoggerContent): void {
    if (!content.category || content.category === LogCategory.App) {
      nestLog(NestLogger.log, content.data, content.event);
      this.appLogger.info(log(LogLevel.Info, content.data, content.event));
    } else if (content.category === LogCategory.Event) {
      this.eventLogger.info(log(LogLevel.Info, content.data, content.event));
    }
  }

  warn(content: LoggerContent): void {
    if (!content.category || content.category === LogCategory.App) {
      nestLog(NestLogger.warn, content.data, content.event);
      this.appLogger.warn(log(LogLevel.Warn, content.data, content.event));
    } else if (content.category === LogCategory.Event) {
      this.eventLogger.warn(log(LogLevel.Warn, content.data, content.event));
    }
  }

  error(content: LoggerContent): void {
    if (content.data instanceof Error) {
      // `JSON.stringify(new Error('test'))` returns `{}`, which is not really useful
      // The following serializes it as `{ message: string, stack: string }`
      if (content.data && content.data.message && content.data.stack) {
        // tslint:disable-next-line:no-parameter-reassignment
        content.data = { message: content.data.message, stack: content.data.stack, ...content.data };
      }
    }
    this.errorLogger.error(log(LogLevel.Error, content.data, content.event));
  }
}

function nestLog(fn: (data: any, event?: string) => void, data: any, event?: string): void {
  const logFn = fn.bind(NestLogger);
  if (typeof data === 'object') {
    logFn(JSON.stringify(data), event);

    return;
  }
  logFn(data, event);
}

function log(level: LogLevel, data: any, event?: string): string {
  const o = {
    Date: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
    Level: level,
  };

  if (event) {
    return stringify({ ...o, Event: event, Data: data });
  }

  return stringify({ ...o, Data: data });
}
