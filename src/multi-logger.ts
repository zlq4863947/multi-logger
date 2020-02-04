import { Logger as NestLogger } from '@nestjs/common';
import * as Log from 'log4js';

import { Meter } from './meter';
import { LogCategory, LogLevel, LoggerContent } from './types';
import { log, nestLog } from './utils';

export class MultiLogger {
  private readonly appLogger: Log.Logger;
  private readonly eventLogger: Log.Logger;
  private readonly errorLogger: Log.Logger;
  private readonly meter: Meter;

  constructor() {
    this.meter = new Meter();
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

  meterStart(label: string): void {
    this.meter.start(label);
  }

  meterEnd(label: string): void {
    this.meter.end(label);
  }

  meterEndWithPrint(label: string): void {
    this.meterEnd(label);
    const logInfo = this.meter.getMeterLog(label);
    const lc: LoggerContent = {
      data: logInfo ? logInfo : '未找到测量日志',
      category: LogCategory.App,
    };
    this.info(lc);
  }

  meterPrint(): void {
    const logInfos = this.meter.getMeterLogs();
    const lc: LoggerContent = {
      data: logInfos.length > 0 ? logInfos : '未找到测量日志',
      category: LogCategory.App,
    };
    this.info(lc);
  }
}
