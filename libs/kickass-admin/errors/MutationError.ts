import CustomError from './CustomError'

class MutationError extends CustomError {
    constructor(message: string) {
        super('MutationError', message)

        Object.setPrototypeOf(this, MutationError.prototype)
    }
}

export default MutationError
