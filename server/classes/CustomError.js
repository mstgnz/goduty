class CustomError extends Error{
    constructor(message, status, inValid=[]){
        super(message);
        this.status = status;
        this.inValid = inValid;
    }
}

module.exports = CustomError;