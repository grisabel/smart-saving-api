import { Body, Param } from '@infrastructure/middlewares/validators/body';

const loginUser = [Body('email').required(), Body('password').required()];

const refreshTokenBody = [Body('refreshToken').required()];

const refreshTokenUrl = [Param('refreshToken').required()];

export default {
  loginUser,
  refreshTokenBody,
  refreshTokenUrl,
};
