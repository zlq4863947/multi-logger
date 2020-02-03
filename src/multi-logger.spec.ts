import { MultiLogger } from './multi-logger';
import { LogCategory } from './types';

describe('MultiLogger', () => {
  it('should log info', async () => {
    const logger = new MultiLogger();
    logger.info({ data: { userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' } });
    logger.info({ data: 'xxxzzXXXQ sss' });
    logger.info({ data: '订单价格未计算出,休眠5秒后,重新尝试', event: '订单1' });
    logger.error({ data: new Error('test error channelNameExist'), event: 'channel name' });

    logger.info({ data: { userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' }, category: LogCategory.Event });
    logger.info({ data: 'xxxzzXXXQ sss', category: LogCategory.Event });
    logger.info({ data: '订单价格未计算出,休眠5秒后,重新尝试', event: '订单1', category: LogCategory.Event });
    logger.error({ data: new Error('test error channelNameExist'), event: 'channel name', category: LogCategory.Event });
  });
  it('should log info2', async () => {
    const logger = new MultiLogger();
    const price = '9393';
    const side = 'Buy';
    const activeOrders = [
      {
        orderID: 'bd05a931-9979-e9f1-63d7-946455822a09',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9392.5,
        stopPx: 9393,
        ordStatus: 'New',
        triggered: 'StopOrderTriggered',
      },
    ];
    const stopOrders = [
      {
        orderID: '052596bc-71f0-f9e5-7a13-82cd2ab40cec',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9393.5,
        stopPx: 9394,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '79ced904-4bcd-2992-25e2-8d05f20148e9',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9393,
        stopPx: 9393.5,
        ordStatus: 'New',
        triggered: '',
      },
      '~Data~activeOrders~0',
      {
        orderID: 'd236d981-6395-7f79-fecf-568e679ccf05',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9394,
        stopPx: 9394.5,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '980dcb9f-f7de-d022-eb3a-74a1ade8378c',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9394.5,
        stopPx: 9395,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '70ac92ed-8eac-0f11-bcef-2bf5248242c8',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9394.5,
        stopPx: 9395,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '6c1c01e5-4fa1-7e9c-7e0a-dc90aee78382',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9396,
        stopPx: 9396.5,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '41fd7289-f129-61c9-df46-5176352bd288',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9395.5,
        stopPx: 9396,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: '0712e080-0e98-0e29-535d-71ffb305816c',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9395,
        stopPx: 9395.5,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: 'ef8adacd-e4d0-7284-68c5-e1e6df59ff8c',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9397,
        stopPx: 9397.5,
        ordStatus: 'New',
        triggered: '',
      },
      {
        orderID: 'e845d4c6-2f61-7d1c-e34b-6e6fa1e330a4',
        account: 1232571,
        symbol: 'XBTUSD',
        side: 'Buy',
        orderQty: 50,
        price: 9396.5,
        stopPx: 9397,
        ordStatus: 'New',
        triggered: '',
      },
    ];
    logger.info({
      data: { price, side, activeOrders, stopOrders },
      event: '实时更新止损单价格0',
      category: LogCategory.App,
    });
  });
});
