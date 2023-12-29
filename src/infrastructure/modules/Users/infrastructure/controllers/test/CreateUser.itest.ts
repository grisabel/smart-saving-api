import axios from 'axios';

describe('POST /user/register', () => {
  it('debe retornar un status 204 (No Content) al crear un usuario satisfactoriamente', async () => {
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'user@email.com',
      repeatEmail: 'user@email.com',
      password: '12345@Aa',
      repeatPassword: '12345@Aa',
    };
    const res = await axios.post(`/user/register`, body);

    expect(res.status).toBe(204);
  });
  it('debe retornar un status 422 si el body está incompleto', async () => {
    //arrange
    const body = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [
        { path: 'firstName' },
        { path: 'lastName' },
        { path: 'dateBirth' },
        { path: 'objetive' },
        { path: 'email' },
        { path: 'repeatEmail' },
        { path: 'password' },
        { path: 'repeatPassword' },
      ],
    };

    //act
    try {
      await axios.post(`/user/register`, body);
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
        expect.objectContaining(response422.errors[2]),
        expect.objectContaining(response422.errors[3]),
        expect.objectContaining(response422.errors[4]),
        expect.objectContaining(response422.errors[5]),
        expect.objectContaining(response422.errors[6]),
        expect.objectContaining(response422.errors[7]),
      ])
    );
  });
  it('debe retornar un status 422 si el email y el repeatEmail no coinciden', async () => {
    //arrange
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'user@email.com',
      repeatEmail: 'user1@email.com',
      password: '12345@Aa',
      repeatPassword: '12345@Aa',
    };
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'repeatEmail' }],
    };

    //act
    try {
      await axios.post(`/user/register`, body);
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
  it('debe retornar un status 422 si la password y la repeatPassword no coinciden', async () => {
    //arrange
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'user@email.com',
      repeatEmail: 'user@email.com',
      password: '12345@Bb',
      repeatPassword: '12345@Aa',
    };
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'repeatPassword' }],
    };

    //act
    try {
      await axios.post(`/user/register`, body);
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
  it('debe retornar un status 422 si el email no sigue el formato definido', async () => {
    //arrange
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'useremail.com',
      repeatEmail: 'useremail.com',
      password: '12345@A',
      repeatPassword: '12345@A',
    };
    let throwError;
    // TODO
    const response422 = {
      message: 'Error al validar el email',
      errors: [
        {
          type: 'EmailError',
          msg: 'El email no tiene un formato válido <nombre>@<dominio>.<extensión_de_dominio>',
        },
      ],
    };

    //act
    try {
      await axios.post(`/user/register`, body);
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
  it('debe retornar un status 422 si la contraseña no sigue el formato definido', async () => {
    //arrange
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'user@email.com',
      repeatEmail: 'user@email.com',
      password: '12345Aa',
      repeatPassword: '12345Aa',
    };
    let throwError;
    // TODO
    const response422 = {
      message: 'Error al validar la contraseña',
      errors: [
        {
          type: 'PasswordError',
          msg: 'La contraseña debe contener al menos alguno de los siguientes caracteres: _ @ # !',
        },
      ],
    };

    //act
    try {
      await axios.post(`/user/register`, body);
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
