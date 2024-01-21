export type DateString = string;
export type DateFormat = string;
export type TimestampMs = string;

export interface DateTimeModel {
  date: DateString;
  format: DateFormat;
}

export type DateTimeSortFnc = (
  dateTime: TimestampMs,
  compareDateTime: TimestampMs
) => number;

export type DateTimeSortSet = {
  ASC: DateTimeSortFnc;
  DES: DateTimeSortFnc;
};

export type DateTimeCompareFnc = (
  dateTime: TimestampMs,
  compareDateTime: TimestampMs
) => boolean;

export type DateTimeCompareSet = {
  UNTIL: DateTimeCompareFnc;
  UNTIL_EXCLUSIVE: DateTimeCompareFnc;
  SINCE: DateTimeCompareFnc;
  SINCE_EXCLUSIVE: DateTimeCompareFnc;
  EQUAL: DateTimeCompareFnc;
};

export interface DateTimeInterfaceService {
  parse: (dateTime: DateTimeModel, format: DateFormat) => DateString;
  isValid(dateTime: DateTimeModel): boolean;
  now(): TimestampMs;

  SORT_SET: DateTimeSortSet;
  sort(
    dateTime: DateTimeModel,
    compareDateTime: DateTimeModel,
    sorter: DateTimeSortFnc
  ): number;

  VALIDATE_SET: DateTimeCompareSet;
  validate(
    dateTime: DateTimeModel,
    compareDateTime: DateTimeModel,
    comparator: DateTimeCompareFnc
  ): boolean;

  getMonthLimits(
    dateTime: DateTimeModel,
    unit: 'week' | 'month' | 'year'
  ): {
    dateStart: DateTimeModel;
    dateEnd: DateTimeModel;
  };
}
