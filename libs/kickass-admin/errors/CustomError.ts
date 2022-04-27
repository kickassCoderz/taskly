class CustomError extends Error {
    constructor(type: string, message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }

        this.name = `[KickassAdmin - ${type}]`
    }
}

export default CustomError
