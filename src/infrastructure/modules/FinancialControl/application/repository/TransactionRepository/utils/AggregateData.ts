import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Transaction } from '../models/Transaction';

interface AggregateByMap {
  [key: string /* any format of DateTimeService */]: Transaction[];
}

const _aggregateBy = (
  transactions: Transaction[],
  format: string
): AggregateByMap => {
  const groupedByDateMap: AggregateByMap = {};
  return transactions.reduce((dateMap, item) => {
    const formattedTime: string = DateTimeService.parse(
      {
        date: item.date,
        format: DATE_FORMATS.Date, // TODO
      },
      format
    );

    let keyExists = false;
    Object.entries(dateMap).forEach((dateMapItem) => {
      const [keyDate, valueArray] = dateMapItem;
      if (formattedTime === keyDate) {
        // key already exists
        valueArray.push(item);
        keyExists = true;
      }
    });

    if (!keyExists) {
      // eslint-disable-next-line no-param-reassign
      dateMap[formattedTime] = [item];
    }
    return dateMap;
  }, groupedByDateMap);
};

export interface TransactionAggregateData {
  date: string /* any format of DateTimeService */;
  amount: number;
}

const AggregateData = {
  byMonth(transactions: Transaction[]): TransactionAggregateData[] {
    const format = DATE_FORMATS.Month;
    const aggregateMap = _aggregateBy(transactions, format);

    const aggregateTransactionsData: TransactionAggregateData[] = [];

    Object.entries(aggregateMap).forEach((aggregateDay) => {
      const [key, valueArray] = aggregateDay;
      const result: TransactionAggregateData = {
        date: key,
        amount: valueArray.reduce((acc, value) => acc + value.amount, 0), // todo suma decimales
      };
      aggregateTransactionsData.push(result);
    });
    // Uncomment to debug
    // console.log({
    //   chartData,
    //   aggregateChartData,
    // });

    return aggregateTransactionsData.sort((a, b) =>
      DateTimeService.sort(
        { date: a.date, format },
        { date: b.date, format },
        DateTimeService.SORT_SET.ASC
      )
    );
  },
};

export default AggregateData;
