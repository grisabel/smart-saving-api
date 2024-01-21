import { DateTime as LuxonDateTime } from 'luxon';
import {
  DateFormat,
  DateString,
  DateTimeCompareFnc,
  DateTimeCompareSet,
  DateTimeInterfaceService,
  DateTimeModel,
  DateTimeSortFnc,
  DateTimeSortSet,
  TimestampMs,
} from './DateTimeInterfaceService';
import { DATE_FORMATS } from './constants';

const _fromFormat = (dateTime: DateTimeModel): LuxonDateTime => {
  switch (dateTime.format) {
    case DATE_FORMATS.TimestampMs:
      const ms = parseInt(dateTime.date, 10);
      return LuxonDateTime.fromMillis(ms, { zone: 'utc' });

    case DATE_FORMATS.TimestampSec:
      const sec = parseInt(dateTime.date, 10);
      return LuxonDateTime.fromSeconds(sec, { zone: 'utc' });

    case DATE_FORMATS.ISO_8601:
      return LuxonDateTime.fromISO(dateTime.date, { zone: 'utc' });

    default:
      return LuxonDateTime.fromFormat(dateTime.date, dateTime.format, {
        zone: 'utc',
      });
  }
};

const _toFormat = (luxon: LuxonDateTime, format: DateFormat): DateString => {
  switch (format) {
    case DATE_FORMATS.TimestampMs:
      const ms = luxon.toMillis();
      return ms.toString();

    case DATE_FORMATS.TimestampSec:
      const sec = luxon.toSeconds();
      return sec.toString();

    case DATE_FORMATS.ISO_8601:
      return luxon.toISO() ?? '';

    default:
      return luxon.toFormat(format);
  }
};

const _toDateTime = (luxon: LuxonDateTime): DateTimeModel => {
  return {
    date: luxon.toFormat(DATE_FORMATS.ISOStringDate),
    format: DATE_FORMATS.ISOStringDate,
  };
};

const parse = (dateTime: DateTimeModel, format: DateFormat): DateString => {
  if (!isValid(dateTime)) {
    throw new Error('Invalid dateTime');
  }
  const luxonDate = _fromFormat(dateTime);
  const formattedDate = _toFormat(luxonDate, format);
  return formattedDate;
};

const isValid = (dateTime: DateTimeModel): boolean => {
  const luxonDate = _fromFormat(dateTime);
  return luxonDate.isValid;
};

const now = (): TimestampMs => {
  return LuxonDateTime.now().toMillis();
};

const SORT_SET: DateTimeSortSet = {
  ASC: (dateTime: TimestampMs, compareDateTime: TimestampMs): number =>
    parseInt(dateTime, 10) - parseInt(compareDateTime, 10),
  DES: (dateTime: TimestampMs, compareDateTime: TimestampMs): number =>
    parseInt(compareDateTime, 10) - parseInt(dateTime, 10),
};

const sort = (
  dateTime: DateTimeModel,
  compareDateTime: DateTimeModel,
  sorter: DateTimeSortFnc
): number => {
  if (!isValid(dateTime) || !isValid(compareDateTime)) {
    throw new Error('Invalid dateTime or compareDateTime');
  }
  const a = parse(dateTime, DATE_FORMATS.TimestampMs);
  const b = parse(compareDateTime, DATE_FORMATS.TimestampMs);

  return sorter(a, b);
};

const VALIDATE_SET: DateTimeCompareSet = {
  UNTIL: (dateTime: TimestampMs, compareDateTime: TimestampMs): boolean =>
    dateTime <= compareDateTime,
  UNTIL_EXCLUSIVE: (
    dateTime: TimestampMs,
    compareDateTime: TimestampMs
  ): boolean => dateTime < compareDateTime,
  SINCE: (dateTime: TimestampMs, compareDateTime: TimestampMs): boolean =>
    dateTime >= compareDateTime,
  SINCE_EXCLUSIVE: (
    dateTime: TimestampMs,
    compareDateTime: TimestampMs
  ): boolean => dateTime > compareDateTime,
  EQUAL: (dateTime: TimestampMs, compareDateTime: TimestampMs): boolean =>
    dateTime == compareDateTime,
};

const validate = (
  dateTime: DateTimeModel,
  compareDateTime: DateTimeModel,
  comparator: DateTimeCompareFnc
): boolean => {
  if (!isValid(dateTime) || !isValid(compareDateTime)) {
    throw new Error('Invalid dateTime or compareDateTime');
  }

  const a = parse(dateTime, DATE_FORMATS.TimestampMs);
  const b = parse(compareDateTime, DATE_FORMATS.TimestampMs);

  return comparator(a, b);
};

const getMonthLimits = (
  dateTime: DateTimeModel,
  unit: 'week' | 'month' | 'year'
): {
  dateStart: DateTimeModel;
  dateEnd: DateTimeModel;
} => {
  // Crea una fecha de Luxon para el primer día del mes
  const luxonDate = _fromFormat(dateTime);
  const firstDay = luxonDate.startOf(unit);
  const lastDay = luxonDate.endOf(unit);

  return {
    dateStart: _toDateTime(firstDay),
    dateEnd: _toDateTime(lastDay),
  };
};

const DateTimeService: DateTimeInterfaceService = {
  parse,
  isValid,
  now,
  SORT_SET,
  sort,
  VALIDATE_SET,
  validate,
  getMonthLimits,
};

export default DateTimeService;
