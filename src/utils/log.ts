import * as moment from 'moment';

import { stringify } from '../stringify';
import { LogLevel } from '../types';

export function log(level: LogLevel, data: any, event?: string): string {
  const o = {
    Date: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
    Level: level,
  };

  if (event) {
    return stringify({ ...o, Event: event, Data: data });
  }

  return stringify({ ...o, Data: data });
}
