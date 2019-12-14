import { Logger } from './logger';

describe('logger', () => {
  it('should log info', async () => {
    const logger = new Logger('./log/info.log');
    logger.info({ userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' });
    logger.info('xxxzzXXXQ sss');
    logger.info('订单价格未计算出,休眠5秒后,重新尝试', '订单1');
    logger.error(new Error('test error channelNameExist'), 'channel name');

    const loggerConsole = new Logger();
    loggerConsole.info({ userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' });
  });
});
