export const ERRORS = {
    length: "La contraseña debe tener al menos 6 caracteres."
}
const MINLENGTH = 6

export class Password {
    private password:string

    constructor(
        password:string
    ){
        if(password.length < MINLENGTH){
            throw new Error(ERRORS.length)
        }
        this.password = password
    }
}