import equalFields from '@infrastructure/validators/EqualFieldsValidator';
import { body, validationResult } from 'express-validator';

// prettier-ignore
const createUser = [
  body('firstName')
    .not().isEmpty(),
  body('lastName')
    .not().isEmpty(),
  body('dateBirth')
    .not().isEmpty(),
  body('objetive')
    .not().isEmpty(),
  body('email')
    .not().isEmpty(),
  body('repeatEmail')
    .not().isEmpty()
    .custom(equalFields('email', 'El email y la repetición del email no coinciden')),
  body('password')
    .not().isEmpty(),
  body('repeatPassword')
    .not().isEmpty()
    .custom(equalFields('password', 'El email y la repetición del email no coinciden')),

];
// prettier-ignore

export default {
  createUser,
};
