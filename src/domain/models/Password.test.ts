
import {Password, ERRORS} from './Password'
describe("La clase Password", () => {
    it("debe poder instanciarse mediante un string", () => {
        //arrange
        const password = 'Aabb@1'
        //act
        const newPassword = new Password(password)
        //assert
        expect(newPassword).toBeInstanceOf(Password)
    })
    it("debe lanzar un error si es menor a 6 caracteres", () => {
        //arrange
        const password = 'Aab@1'
    
        //assert
        expect(() => {
            new Password(password)
        }).toThrow(ERRORS.length)
        
    })
})