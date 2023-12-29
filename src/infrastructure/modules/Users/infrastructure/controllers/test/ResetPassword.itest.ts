import { Id } from '@domain/models/Id/Id';
import axios from 'axios';

describe('Reset Password', () => {
  describe('POST /user/reset-password', () => {
    it('debe retornar un status 200 indicando que se ha enviado un email si los datos son válidos (email y dateBirth)', async () => {
      const bodyRegister = {
        firstName: 'User Name',
        lastName: 'User Surname',
        dateBirth: '30/01/1997',
        objetive: 'Personal Objetive',
        email: 'user@email.com',
        repeatEmail: 'user@email.com',
        password: '12345@Aa',
        repeatPassword: '12345@Aa',
      };
      await axios.post(`/user/register`, bodyRegister);

      const body = {
        dateBirth: bodyRegister.dateBirth,
        email: bodyRegister.email,
      };
      const res = await axios.post(`/user/reset-password`, body);

      expect(res.status).toEqual(200);
      expect(res.data.message).toEqual(
        'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
      );
    });
    it('debe retornar un status 200 indicando que se ha enviado un email aunque los datos sean inválidos (email o dateBirth)', async () => {
      const body = {
        dateBirth: '30/01/1997',
        email: 'user@email.com',
      };
      const res = await axios.post(`/user/reset-password`, body);

      expect(res.status).toEqual(200);
      expect(res.data.message).toEqual(
        'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
      );
    });
    it('debe retornar un 422 si el campo dateBirth del body no sigue el formato correcto', async () => {
      //arrange
      const body = {
        dateBirth: '29-12-2023',
        email: 'user@email.com',
      };
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'dateBirth' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(response422.errors[0])])
      );
    });
    it('debe retornar un 422 si el campo email del body no sigue el formato correcto', async () => {
      //arrange
      const body = {
        dateBirth: '29/12/2023',
        email: 'user@email',
      };
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'email' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(response422.errors[0])])
      );
    });
  });
  // TODO añadir error generico
  describe('POST /user/reset-password/:operationId/confirm', () => {
    // it('debe retornar un status 200 indicando que se ha enviado un email si los datos son válidos (email y dateBirth)', async () => {
    //   const bodyRegister = {
    //     firstName: 'User Name',
    //     lastName: 'User Surname',
    //     dateBirth: '30/01/1997',
    //     objetive: 'Personal Objetive',
    //     email: 'user@email.com',
    //     repeatEmail: 'user@email.com',
    //     password: '12345@Aa',
    //     repeatPassword: '12345@Aa',
    //   };
    //   await axios.post(`/user/register`, bodyRegister);

    //   const body = {
    //     dateBirth: bodyRegister.dateBirth,
    //     email: bodyRegister.email,
    //   };
    //   const res = await axios.post(`/user/reset-password`, body);

    //   expect(res.status).toEqual(200);
    //   expect(res.data.message).toEqual(
    //     'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
    //   );
    // });
    it('debe retornar un 422 si el campo operationId de la url no sigue el formato correcto', async () => {
      //arrange
      const operationId = '1111';
      const body = {
        password: '12345@Aa',
        repeatPassword: '12345@Aa',
      };
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'operationId' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password/${operationId}/confirm`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(response422.errors[0])])
      );
    });
    it('debe retornar un 422 si el campo password o repeatPassword del body no estan presentes', async () => {
      //arrange
      const operationId = Id.createId();
      const body = {};
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'password' }, { path: 'repeatPassword' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password/${operationId}/confirm`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining(response422.errors[0]),
          expect.objectContaining(response422.errors[1]),
        ])
      );
    });
    it('debe retornar un 422 si el campo password no sigue el formato correcto', async () => {
      //arrange
      const operationId = Id.createId();
      const body = {
        password: '12345@',
        repeatPassword: '12345@',
      };
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'password' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password/${operationId}/confirm`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(response422.errors[0])])
      );
    });
    it('debe retornar un 422 si el campo repeatPassword coincide con el campo password', async () => {
      //arrange
      const operationId = Id.createId();
      const body = {
        password: '12345@Aa',
        repeatPassword: '12345@',
      };
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'repeatPassword' }],
      };

      //act
      try {
        await axios.post(`/user/reset-password/${operationId}/confirm`, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(422);
      expect(throwError.response.data.message).toEqual(response422.message);
      expect(throwError.response.data.errors).toEqual(
        expect.arrayContaining([expect.objectContaining(response422.errors[0])])
      );
    });
  });
  // TODO añadir error generico
});
