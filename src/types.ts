export enum LogLevel {
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

export interface LoggerOptions {
  filePath?: string;
  maxLogSize?: number;
  backups?: number;
}
