import { prisma } from '@application/repository/db';
import axios from 'axios';

const URL = '/financial-control/concept/income';

describe(`El endpoint POST ${URL}`, () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.operation.deleteMany();
    await prisma.revokeAccessToken.deleteMany();
    await prisma.session.deleteMany();
    await prisma.financialAccount.deleteMany();
    await prisma.income.deleteMany();
    await prisma.expense.deleteMany();
  });

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
});
