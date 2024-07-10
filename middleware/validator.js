// // const Joi = require('joi');
// import Joi from "joi"

// const validator = (req, res, next) => {
//     console.log("hello")

//     const {email, password} = req.body

//     // const userInfo = {email, password}


//     const schema = Joi.object({
//         // username: Joi.string()
//         //     .alphanum()
//         //     .min(3)
//         //     .max(30),
//         // .required(),

//         // password: Joi.string(password).required(),


//         // repeat_password: Joi.ref('password'),

//         // access_token: [
//         //     Joi.string(),
//         //     Joi.number()
//         // ],


//         email: Joi.string()
//             .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
//     })

//     // schema.validate();

//     // -> { value: { username: 'abc', birth_year: 1994 } }

//     // schema.validate({});
//     // -> { value: {}, error: '"username" is required' }

//     try {
//         const value = schema.validate(password);
//         console.log(value)
//     }
//     catch (err) { console.log(err.detail) }

//     next()


// }

// export default validator









// // Also -
import Joi from 'joi';

const validator = (req, res, next) => {
    console.log("hello");

    const { email, password } = req.body;

    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().required()
    });

    const { error, value } = schema.validate({ email, password });

    if (error) {
        // Send a response with the validation error
        return res.status(400).json({ error: error.details[0].message });
    }

    console.log(value);
    next();
};

export default validator;
