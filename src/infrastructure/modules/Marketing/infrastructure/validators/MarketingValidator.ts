import { Body } from '@infrastructure/middlewares/validators/body';

const createContactForm = [
  Body('name').required(),
  Body('email').required(),
  Body('subject').required(),
  Body('description').required(),
];

export default {
  createContactForm,
};
