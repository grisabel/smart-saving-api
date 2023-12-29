import { DateTime as LuxonDateTime } from 'luxon';
import {
  DateFormat,
  DateString,
  DateTimeInterfaceService,
  DateTimeModel,
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

const DateTimeService: DateTimeInterfaceService = {
  parse(dateTime: DateTimeModel, format: DateFormat): DateString {
    const luxonDate = _fromFormat(dateTime);
    const formattedDate = _toFormat(luxonDate, format);
    return formattedDate;
  },

  isValid(dateTime: DateTimeModel): boolean {
    const luxonDate = _fromFormat(dateTime);
    return luxonDate.isValid;
  },
};

export default DateTimeService;
