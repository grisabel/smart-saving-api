import { prisma } from '@application/repository/db';
import { Id } from '@domain/models/Id/Id';
import axios from 'axios';

const URL = '/financial-control/concept/expense';

describe(`La ruta ${URL}`, () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.operation.deleteMany();
    await prisma.revokeAccessToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.financialAccount.deleteMany();
    await prisma.income.deleteMany();
    await prisma.expense.deleteMany();
  });

  describe(`El endpoint POST`, () => {
    it('debe retornar un status 401 si la petición no esta autenticada', async () => {
      const body = {
        concept: 'Custom Concept',
      };

      let throwError;
      const response401 = {
        message:
          'Access token is missing. Please provide a valid token in headers to continue.',
      };

      //act
      try {
        await axios.post(URL, body);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(401);
      expect(throwError.response.data.message).toEqual(response401.message);
    });

    it('debe retornar un status 422 si body no sigue el formato correcto', async () => {
      const body = {};
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'concept' }],
      };

      //act
      try {
        await axios.post(URL, body);
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

  describe(`El endpoint GET`, () => {
    it('debe retornar un status 401 si la petición no esta autenticada', async () => {
      let throwError;
      const response401 = {
        message:
          'Access token is missing. Please provide a valid token in headers to continue.',
      };

      //act
      try {
        await axios.get(URL);
      } catch (error) {
        throwError = error;
      }

      //assert
      expect(throwError.response.status).toBe(401);
      expect(throwError.response.data.message).toEqual(response401.message);
    });
  });

  describe(`El endpoint DELETE`, () => {
    it('debe retornar un status 401 si la petición no esta autenticada', async () => {
      const conceptId = Id.createId().getValue();

      let throwError;
      const response401 = {
        message:
          'Access token is missing. Please provide a valid token in headers to continue.',
      };

      //act
      try {
        await axios.delete(`${URL}/${conceptId}`);
      } catch (error) {
        throwError = error;
      }

      //assert
      console.log({ a: throwError.response.data.errors });
      expect(throwError.response.status).toBe(401);
      expect(throwError.response.data.message).toEqual(response401.message);
    });

    it('debe retornar un status 422 si body no sigue el formato correcto', async () => {
      const conceptId = '1';
      let throwError;
      const response422 = {
        message: 'Validación incorrecta',
        errors: [{ path: 'conceptId' }],
      };

      //act
      try {
        await axios.delete(`${URL}/${conceptId}`);
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
});
