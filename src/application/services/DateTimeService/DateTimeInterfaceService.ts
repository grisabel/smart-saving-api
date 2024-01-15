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

export interface DateTimeInterfaceService {
  parse: (dateTime: DateTimeModel, format: DateFormat) => DateString;
  isValid(dateTime: DateTimeModel): boolean;
  now(): TimestampMs;

  SORT_SET: DateTimeSortSet;
  sort(
    dateTime: DateTimeModel,
    compareDateTime: DateTimeModel,
    comparator: DateTimeSortFnc
  ): number;
}
