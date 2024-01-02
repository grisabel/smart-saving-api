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
})