# multi-logger

multi-file logging toolkit

## install

```
npm install multi-logger
```

## logging a single file

```
import { Logger } from 'multi-logger';

// Initialize and configure the location of the log file
const logger = new Logger('./log/info.log');
logger.info({ userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' });
logger.info('xxxzzXXXQ sss');
logger.info('订单价格未计算出,休眠5秒后,重新尝试', '订单1');
logger.error(new Error('test error channelNameExist'), 'channel name');
```

## logging multiple file

Each LogCategory is a separate file

default output log file path: {Your project}/logs
```
import { LogCategory, MultiLogger } from 'multi-logger';

const logger = new MultiLogger();
logger.info({ data: { userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' } });
logger.info({ data: '订单价格未计算出,休眠5秒后,重新尝试', event: '订单1' });
logger.error({ data: new Error('test error channelNameExist'), event: 'channel name' });
logger.info({ data: { userUuid: 'xxxxxxxxxx', hoge: 'xxxxxxxxxx' }, category: LogCategory.Event });
logger.info({
  data: { ... },
  event: '实时更新止损单价格0',
  category: LogCategory.App,
});
```