import { Password } from '@domain/models/Password';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { CustomValidator, ValidationChain } from 'express-validator';

export const password = (): CustomValidator => {
  return (value) => {
    try {
      Password.createFromText(value);
      return true;
    } catch (error) {
      const errorDto = ErrorResponseMapper.toResponseDto({
        message: 'Error al validar la contraseña',
        error,
      });
      throw new Error((errorDto.errors ?? []).map((err) => err.msg).join(','));
    }
  };
};
