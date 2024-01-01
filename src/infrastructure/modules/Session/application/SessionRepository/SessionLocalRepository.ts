import { Email } from '@domain/models/Email';
import {
  SessionInterfaceRepository,
  SessionReasonType,
  SessionType,
} from './SessionInterfaceRepository';
import { TimestampMs } from '@application/services/DateTimeService/DateTimeInterfaceService';

export class SessionLocalRepository implements SessionInterfaceRepository {
  saveSessionStart(
    email: Email,
    ip: string,
    expiresIn: TimestampMs,
    isLoginSuccess: boolean
  ): Promise<void> {
    return Promise.resolve();
  }
  saveSessionRefresh(
    email: Email,
    ip: string,
    expiresIn: TimestampMs
  ): Promise<void> {
    return Promise.resolve();
  }
  saveSessionEnd(
    email: Email,
    ip: string,
    reason: SessionReasonType
  ): Promise<void> {
    return Promise.resolve();
  }
  saveSessionRevoke(email: Email, ip: string): Promise<void> {
    return Promise.resolve();
  }
}
