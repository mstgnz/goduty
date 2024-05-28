class Validate{

    static points = [
        "auth/register",
        "auth/login",
        "auth/logout"
    ];

    static regex = {
        email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/,
        password: /^[^\'\"<>;,]+$/,
        name: /^([\w]+)$/,
        phone: /^([0-9\+\s]+)$/
    }

    static check(endpoint, body){
        this.validate = [];
        if(this.points.includes(endpoint)){
            const valid = this.valid(endpoint);
            for(let key in body) {
                if(valid.hasOwnProperty(key)){
                    if(body[key].match(valid[key]) === null){
                        if(!this.validate.includes(key)) this.validate.push(key);
                    }
                }
            }
        }
        return this.validate;
    }

    static valid(endpoint){
        const validator = {
            "auth/register": {
                firstName: this.regex.name,
                lastName: this.regex.name,
                email: this.regex.email,
                password: this.regex.password
            },
            "auth/login": {
                email: this.regex.email,
                password: this.regex.password
            }
        }
        return validator[endpoint];
    }
    
}

module.exports = Validate;