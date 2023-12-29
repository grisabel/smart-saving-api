import axios from 'axios';

describe('POST /user/reset-password', () => {
  //   it('debe retornar un status 200 y la información del usuario', async () => {
  //     const body = {
  //       firstName: 'User Name',
  //       lastName: 'User Surname',
  //       dateBirth: '30/01/1997',
  //       objetive: 'Personal Objetive',
  //       email: 'user@email.com',
  //       repeatEmail: 'user@email.com',
  //       password: '12345@Aa',
  //       repeatPassword: '12345@Aa',
  //     };
  //     await axios.post(`/user/register`, body);

  //     const resLogin = await axios.post(`/session/login`, {
  //       email: 'user@email.com',
  //       password: '12345@Aa',
  //     });

  //     const res = await axios.get(`/user/info`, {
  //       headers: {
  //         Authorization: `Bearer ${resLogin.data.accessToken}`,
  //       },
  //     });

  //     expect(res.status).toEqual(200);
  //     expect(res.data.firstName).toEqual(body.firstName);
  //     expect(res.data.lastName).toEqual(body.lastName);
  //     expect(res.data.dateBirth).toEqual(body.dateBirth);
  //     expect(res.data.objective).toEqual(body.objetive);
  //     expect(res.data.email).toEqual(body.email);
  //   });
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
