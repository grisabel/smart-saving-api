import IdService from '@application/services/IdService';
import axios from 'axios';

describe('Delete Account', () => {
  describe('DELETE /user/account', () => {
    it('debe retornar un status 200 y un operationId', async () => {
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
      await axios.post(`/user/register`, body);

      const resLogin = await axios.post(`/session/login`, {
        email: 'user@email.com',
        password: '12345@Aa',
      });

      const res = await axios.delete(`/user/account`, {
        headers: {
          Authorization: `Bearer ${resLogin.data.accessToken}`,
        },
      });

      expect(res.status).toEqual(200);
      expect(IdService.isValid(res.data.operationId)).toEqual(true);
    });
    it('debe retornar un 401 si la petición no esta autenticada', async () => {
      let throwError;
      try {
        await axios.delete(`/user/account`);
      } catch (error) {
        throwError = error;
      }

      expect(throwError.response.status).toEqual(401);
    });
  });
  // TODO añadir error generico
});
