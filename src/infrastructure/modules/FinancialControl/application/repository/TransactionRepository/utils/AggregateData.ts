import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Transaction } from '../models/Transaction';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';

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
        amount: valueArray.reduce((acc, value) => {
          const constant = 100;
          const result = acc + value.amount;
          return Math.round(result * constant) / constant;
        }, 0), // todo suma decimales
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
  byMonthDefault(year: DateTimeModel): TransactionAggregateData[] {
    const _year = DateTimeService.parse(year, DATE_FORMATS.Year);
    const months = [
      `01/${_year}`,
      `02/${_year}`,
      `03/${_year}`,
      `04/${_year}`,
      `05/${_year}`,
      `06/${_year}`,
      `07/${_year}`,
      `08/${_year}`,
      `09/${_year}`,
      `10/${_year}`,
      `11/${_year}`,
      `12/${_year}`,
    ];

    return months.map((month) => {
      return {
        date: month,
        amount: 0,
      };
    });
  },
};

export default AggregateData;
