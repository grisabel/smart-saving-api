import axios from 'axios';

describe('El endpoint GET /financial-control/accounts/0/summary', () => {
  it('debe retornar un status 401 si la petición no esta autenticada', async () => {
    const accountNumber = 0;

    let throwError;
    const response401 = {
      message:
        'Access token is missing. Please provide a valid token in headers to continue.',
    };

    //act
    try {
      await axios.get(`financial-control/accounts/${accountNumber}/summary`);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
  });
  it('debe retornar un status 422 si parametro accountNumber de la url no sigue el formato correcto', async () => {
    const accountNumber = 'testAccount';

    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'accountNumber' }],
    };

    //act
    try {
      await axios.get(`financial-control/accounts/${accountNumber}/summary`);
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
  it('debe retornar un status 404 si el accountNumber no existe', async () => {
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'test@test.com',
      repeatEmail: 'test@test.com',
      password: 'Aabb@1',
      repeatPassword: 'Aabb@1',
    };
    const accountNumber = 0;

    let throwError;
    const response401 = {
      message: 'Cuenta no existente',
    };

    //act
    try {
      await axios.post(`/user/register`, body);

      const resLogin = await axios.post(`/session/login`, {
        email: body.email,
        password: body.password,
      });
      await axios.get(`financial-control/accounts/${accountNumber}/summary`, {
        headers: {
          Authorization: `Bearer ${resLogin.data.accessToken}`,
        },
      });
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(404);
    expect(throwError.response.data.message).toEqual(response401.message);
  });

  it('debe retornar un status 200 y un objeto con las propiedades incomes y expenses', async () => {});
});
