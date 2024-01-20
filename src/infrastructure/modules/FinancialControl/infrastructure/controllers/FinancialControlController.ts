import { NextFunction, Request, Response } from 'express';

import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { FinancialAccountUseCaseFactory } from '@FinancialControl/domain/useCases/FinancialAccountUseCase';
import { FinancialAccountConceptRequestDto } from '../dtos/request/FinancialAccountConceptRequestDto';
import { FinancialAccountConceptResponseDto } from '../dtos/response/FinancialAccountConceptResponseDto';

import { FinancialAccountSummaryRequestDto } from '../dtos/request/FinancialAccountSummaryRequestDto';
import { FinancialAccountSummaryResponseDto } from '../dtos/response/FinancialAccountSummaryResponseDto';

import { FinancialAccountConceptListResponseDto } from '../dtos/response/FinancialAccountConceptListResponseDto';

import { FinancialAccountDeleteConceptRequestDto } from '../dtos/request/FinancialAccountDeleteConceptRequestDto';

import { Email } from '@domain/models/Email';
import { FinancialAccountTransactionRequestDto } from '../dtos/request/FinancialAccountTransactionRequestDto';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { FinancialAccountReportRequestDto } from '../dtos/request/FinancialAccountReportRequestDto';
import { FinancialAccountReportsResponseDto } from '../dtos/response/FinancialAccountReportsResponseDto';

const financialAccountUseCase = FinancialAccountUseCaseFactory.getIntance();

const obtainConceptIncome = async (
  req: Request,
  res: Response<FinancialAccountConceptListResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);

    const [errorDto, resulDto] = await financialAccountUseCase.obtainConcept(
      email,
      'income'
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

const obtainConceptExpense = async (
  req: Request,
  res: Response<FinancialAccountConceptListResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);

    const [errorDto, resulDto] = await financialAccountUseCase.obtainConcept(
      email,
      'expense'
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

const addConceptIncome = async (
  req: Request<FinancialAccountConceptRequestDto>,
  res: Response<FinancialAccountConceptResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const concept = req.body.concept;

    const [errorDto, resulDto] = await financialAccountUseCase.addConcept(
      email,
      'income',
      concept
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

const addConceptExpense = async (
  req: Request<FinancialAccountConceptRequestDto>,
  res: Response<FinancialAccountConceptResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const concept = req.body.concept;

    const [errorDto, resulDto] = await financialAccountUseCase.addConcept(
      email,
      'expense',
      concept
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

const deleteConceptIncome = async (
  req: Request<FinancialAccountDeleteConceptRequestDto>,
  res: Response<{} | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const conceptId = req.params.conceptId;

    const [errorDto, resulDto] = await financialAccountUseCase.deleteConcept(
      email,
      'income',
      conceptId
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200);
  } catch (error) {
    next(error);
  }
};

const deleteConceptExpense = async (
  req: Request<FinancialAccountDeleteConceptRequestDto>,
  res: Response<{} | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const conceptId = req.params.conceptId;

    const [errorDto, resulDto] = await financialAccountUseCase.deleteConcept(
      email,
      'expense',
      conceptId
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200);
  } catch (error) {
    next(error);
  }
};

const obtainAccountSummary = async (
  req: Request<FinancialAccountSummaryRequestDto>,
  res: Response<FinancialAccountSummaryResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const year: DateTimeModel = req.params?.year
      ? {
          date: req.params.year,
          format: DATE_FORMATS.Year,
        }
      : {
          date: `${new Date().getFullYear()}`,
          format: DATE_FORMATS.Year,
        };

    const [errorDto, resulDto] = await financialAccountUseCase.obtainSummary(
      email,
      accountNumber,
      year
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

const addIncome = async (
  req: Request<FinancialAccountTransactionRequestDto>,
  res: Response<FinancialAccountSummaryResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const accountNumber = parseInt(req.params.accountNumber, 10);

    const [errorDto, resulDto] = await financialAccountUseCase.addTransaction(
      email,
      accountNumber,
      {
        amount: req.body.amount,
        conceptId: req.body.conceptId,
        date: req.body.date,
        note: req.body.note,
      },
      'income'
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).send();
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const addExpense = async (
  req: Request<FinancialAccountTransactionRequestDto>,
  res: Response<FinancialAccountSummaryResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const accountNumber = parseInt(req.params.accountNumber, 10);

    const [errorDto, resulDto] = await financialAccountUseCase.addTransaction(
      email,
      accountNumber,
      {
        amount: req.body.amount,
        conceptId: req.body.conceptId,
        date: req.body.date,
        note: req.body.note,
      },
      'expense'
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const obtainIncomeReport = async (
  req: Request<FinancialAccountReportRequestDto>,
  res: Response<FinancialAccountReportsResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const accountNumber = parseInt(req.params.accountNumber, 10);

    const dateTo: DateTimeModel = {
      date: req.query.dateTo as string,
      format: DATE_FORMATS.Date,
    };

    const dateFrom: DateTimeModel = {
      date: req.query.dateFrom as string,
      format: DATE_FORMATS.Date,
    };

    const [errorDto, resulDto] = await financialAccountUseCase.obtainReports(
      email,
      accountNumber,
      dateTo,
      dateFrom,
      'income'
    );

    if (errorDto) {
      res.status(404).json(errorDto);
      return;
    }
    res.status(200).json(resulDto);
  } catch (error) {
    next(error);
  }
};

export default {
  obtainConceptIncome,
  obtainConceptExpense,
  addConceptIncome,
  addConceptExpense,
  deleteConceptIncome,
  deleteConceptExpense,
  obtainAccountSummary,
  addIncome,
  addExpense,
  obtainIncomeReport,
};
