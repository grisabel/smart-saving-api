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

const financialAccountUseCaseFactory =
  FinancialAccountUseCaseFactory.getIntance();

const obtainConceptIncome = async (
  req: Request,
  res: Response<FinancialAccountConceptListResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    res.status(200).json([{ id: 0, concept: 'a' }]);
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
    res.status(200).json([{ id: 0, concept: 'a' }]);
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
    res.status(200).json({ id: 0, concept: 'a' });
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
    res.status(200).json({ id: 0, concept: 'a' });
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
    res.status(200).json();
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
    res.status(200).json();
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

    const [errorDto, resulDto] =
      await financialAccountUseCaseFactory.obtainSummary(email, accountNumber);

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
};
