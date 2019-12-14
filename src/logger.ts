import { Logger as NestLogger } from '@nestjs/common';
import * as Log from 'log4js';
import * as moment from 'moment';

import { stringify } from './stringify';

enum LogLevel {
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'Error',
}

export interface LoggerOptions {
  filePath?: string;
  maxLogSize?: number;
  backups?: number;
}

Date.prototype.toLocaleString = () => moment().format('YYYY-MM-DD HH:mm:ss.SSS');

export class Logger {
  private readonly logger: Log.Logger;
  private readonly opts: LoggerOptions;

  constructor(filePath?: string | LoggerOptions) {
    if (typeof filePath === 'string') {
      this.opts = {
        filePath,
      };
    } else if (typeof filePath === 'object') {
      this.opts = filePath;
    } else {
      this.opts = {};
    }

    const layout = {
      type: 'messagePassThrough',
    };

    const defaultOpts = {
      maxLogSize: 1024 * 1024 * 10,
      backups: 30,
    };

    const appenders = {
      default: {
        type: this.opts.filePath ? 'dateFile' : 'console',
        filename: this.opts.filePath || '',
        maxLogSize: this.opts.maxLogSize || defaultOpts.maxLogSize,
        backups: this.opts.backups || defaultOpts.backups,
        layout,
      },
    };

    const categories = {
      default: {
        appenders: ['default'],
        level: 'INFO',
      },
    };

    Log.configure({ appenders, categories });
    this.logger = Log.getLogger();
  }

  info(data: any, event?: string): void {
    if (this.opts.filePath) {
      nestLog(NestLogger.log, data, event);
    }
    this.logger.info(log(LogLevel.Info, data, event));
  }

  warn(data: any, event?: string): void {
    if (this.opts.filePath) {
      nestLog(NestLogger.warn, data, event);
    }
    this.logger.warn(log(LogLevel.Warn, data, event));
  }

  error(data: any, event?: string): void {
    if (data instanceof Error) {
      // `JSON.stringify(new Error('test'))` returns `{}`, which is not really useful
      // The following serializes it as `{ message: string, stack: string }`
      if (data && data.message && data.stack) {
        // tslint:disable-next-line:no-parameter-reassignment
        data = { message: data.message, stack: data.stack, ...data };
      }
    }
    if (this.opts.filePath) {
      nestLog(NestLogger.error, data, event);
    }
    this.logger.info(log(LogLevel.Info, '发生异常', event));
    this.logger.error(log(LogLevel.Error, data, event));
  }
}

export function console(data: any, event?: string): void {
  NestLogger.log(data, event);
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
