export type DateString = string;
export type DateFormat = string;
export type TimestampMs = string;

export interface DateTimeModel {
  date: DateString;
  format: DateFormat;
}

export interface DateTimeInterfaceService {
  parse: (dateTime: DateTimeModel, format: DateFormat) => DateString;
  isValid(dateTime: DateTimeModel): boolean;
  now(): TimestampMs;
}
