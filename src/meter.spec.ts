import { Meter } from './meter';
import { sleep } from './utils';

describe('meter', () => {
  it('should Meter info', async () => {
    const meter = new Meter();
    meter.start('init');
    await sleep(3500);
    meter.end('init');
    console.log(meter.getMeterLog());
    console.log(meter.getMeterLog());
  });
});
