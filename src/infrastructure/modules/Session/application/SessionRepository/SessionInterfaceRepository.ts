import { TimestampMs } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { Email } from '@domain/models/Email';

export enum SessionType {
  Session_Start = 'Session_Start',
  Session_End = 'Session_End',
  Session_Refresh = 'Session_Refresh',
  Session_Revoke = 'Session_Revoke',
}

export enum SessionReasonType {
  Session_Token_Expired = 'Session_Token_Expired',
  Session_User_Logout = 'Session_User_Logout',
}

export interface SessionInterfaceRepository {
  saveSessionStart(
    email: Email,
    ip: string,
    expiresIn: TimestampMs | null,
    isLoginSuccess: boolean
  ): Promise<void>;
  saveSessionRefresh(
    email: Email,
    ip: string,
    expiresIn: TimestampMs
  ): Promise<void>;
  saveSessionEnd(
    email: Email,
    ip: string,
    reason: SessionReasonType
  ): Promise<void>;
  saveSessionRevoke(email: Email, ip: string): Promise<void>;
}
