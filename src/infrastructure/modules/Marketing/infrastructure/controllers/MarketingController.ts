import { NextFunction, Request, Response } from 'express';

import { MarketingUseCaseFactory } from '../../domain/useCases/MarketingUseCase';
import { ContactFormRequestModel } from '../dtos/request/ContactFormRequestModel';

const userUseCase = MarketingUseCaseFactory.getIntance();

const createContactForm = async (
  req: Request<ContactFormRequestModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const contactForm: ContactFormRequestModel = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      description: req.body.description,
    };

    await userUseCase.createContactForm(contactForm);

    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export default {
  createContactForm,
};
