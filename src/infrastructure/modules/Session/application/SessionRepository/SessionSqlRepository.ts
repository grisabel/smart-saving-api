import { Email } from '@domain/models/Email';
import {
  SessionInterfaceRepository,
  SessionReasonType,
  SessionType,
} from './SessionInterfaceRepository';
import { DDBBConnectionError, prisma } from '@application/repository/db';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { TimestampMs } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';

export class SessionSqlRepository implements SessionInterfaceRepository {
  saveSessionStart(
    email: Email,
    ip: string,
    expiresIn: TimestampMs | null,
    isLoginSuccess: boolean
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const resul = await prisma.session.findMany({
          where: {
            userEmail: email.getValue(),
            sessionType: SessionType.Session_Start,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        });

        let prevFailuresNumber = 0;

        if (resul.length > 0) {
          prevFailuresNumber = resul[0].failuresNumber;
        }

        const failuresNumber = isLoginSuccess ? 0 : prevFailuresNumber + 1;

        await prisma.session.create({
          data: {
            userEmail: email.getValue(),
            sessionType: SessionType.Session_Start,
            ip: ip,
            expiresIn: isLoginSuccess
              ? DateTimeService.parse(
                  {
                    date: expiresIn,
                    format: DATE_FORMATS.TimestampMs,
                  },
                  DATE_FORMATS.ISO_8601
                )
              : null,
            failuresNumber: failuresNumber,
          },
        });
        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
  saveSessionRefresh(
    email: Email,
    ip: string,
    expiresIn: TimestampMs
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.session.create({
          data: {
            userEmail: email.getValue(),
            sessionType: SessionType.Session_Refresh,
            ip: ip,
            expiresIn: DateTimeService.parse(
              {
                date: expiresIn,
                format: DATE_FORMATS.TimestampMs,
              },
              DATE_FORMATS.ISO_8601
            ),
          },
        });
        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
  saveSessionEnd(
    email: Email,
    ip: string,
    reason: SessionReasonType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.session.create({
          data: {
            userEmail: email.getValue(),
            sessionType: SessionType.Session_End,
            ip: ip,
            expiresIn: null,
            reason: SessionReasonType[reason],
          },
        });
        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
  saveSessionRevoke(email: Email, ip: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.session.create({
          data: {
            userEmail: email.getValue(),
            sessionType: SessionType.Session_Revoke,
            ip: ip,
            expiresIn: null,
          },
        });
        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
}
