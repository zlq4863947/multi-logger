import moment = require('moment');

const format = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

export interface MeterLog {
  label: string;
  start: string;
  end?: string;
  cost?: string;
}

interface MeterInfo extends MeterLog {
  startTime: number;
  endTime?: number;
}

export class Meter {
  meterInfos: MeterInfo[] = [];

  start(label: string): void {
    const info: MeterInfo = {
      label,
      start: moment().format(format),
      startTime: Date.now(),
    };

    const foundIndex = this.meterInfos.findIndex((o) => o.label === label);

    if (foundIndex !== -1) {
      this.meterInfos[foundIndex] = info;
    } else {
      this.meterInfos.push(info);
    }
  }

  end(label: string): void {
    const info = this.meterInfos.find((o) => o.label === label);
    if (!info) {
      return;
    }
    info.end = moment().format(format);
    info.endTime = Date.now();
    info.cost = `${(info.endTime - info.startTime) / 1000}s`;
  }

  getMeterLog(label: string): MeterLog | undefined {
    const logIndex = this.meterInfos.findIndex((o) => o.label === label);
    if (logIndex !== -1) {
      const logs = this.meterInfos.splice(logIndex, 1).map((o) => ({
        label: o.label,
        start: o.start,
        end: o.end,
        cost: o.cost,
      }));

      if (logs.length > 0) {
        return logs[0];
      }
    }

    return;
  }

  getMeterLogs(): MeterLog[] {
    const list = this.meterInfos.map((o) => ({
      label: o.label,
      start: o.start,
      end: o.end,
      cost: o.cost,
    }));
    this.meterInfos = [];

    return list;
  }
}
