import axios from 'axios';

describe("El endpoint GET /financial-control/accounts/0/summary", () => {
    it("debe retornar un status 401 si la petición no esta autenticada", async () => {
        const accountId = 0;

        let throwError;
        const response401 = {
        message: 'Access token is missing. Please provide a valid token in headers to continue.',
        };
    
        //act
        try {
        await axios.get(`financial-control/accounts/${accountId}/summary`);
        } catch (error) {
        throwError = error;
        }
    
        //assert
        expect(throwError.response.status).toBe(401);
        expect(throwError.response.data.message).toEqual(response401.message);
    })
    it("debe retornar un status 422 si parametro accountId de la url no sigue el formato correcto", async () => {
        const accountId = 'testAccount';

        let throwError;    
        const response422 = {
            message: 'Validación incorrecta',
            errors: [{ path: 'accountId' }],
        };

        //act
        try {
        await axios.get(`financial-control/accounts/${accountId}/summary`);
        } catch (error) {
        throwError = error;
        }
    
        //assert
        expect(throwError.response.status).toBe(422);
        expect(throwError.response.data.message).toEqual(response422.message);
        expect(throwError.response.data.errors).toEqual(
          expect.arrayContaining([expect.objectContaining(response422.errors[0])])
        );
    })
})