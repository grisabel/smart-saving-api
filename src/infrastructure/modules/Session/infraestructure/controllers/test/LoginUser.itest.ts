import axios from 'axios';

describe('POST /session/login', () => {
  it('debe retornar un status 200 y un accesToken al loguear un usuario satisfactoriamente', async () => {
    const body = {
      email: 'test@test.com',
      password: 'Aabb@1',
    };
    const res = await axios.post(`/session/login`, body);

    expect(res.status).toBe(200);
    expect(res.data.accessToken.split('.').length).toEqual(3);
    expect(res.data.refreshToken.split('.').length).toEqual(3);
  });
  it('debe retornar un status 422 si el body está incompleto', async () => {
    //arrange
    const body = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'email' }, { path: 'password' }],
    };

    //act
    try {
      await axios.post(`/session/login`, body);
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
  it('debe retornar un status 401 si el usuario o contrasña no coinciden', async () => {
    const body = {
      email: 'test@test2.com',
      password: 'Aabb@12',
    };
    ('');
    let throwError;
    const response401 = {
      message: 'Usuario o contraseña incorrectos',
    };

    //act
    try {
      await axios.post(`/session/login`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
  });
});
