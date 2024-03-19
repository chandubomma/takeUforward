import Joi from 'joi';

const validate = async (schema, req, res, next) => {
    let body = Object.assign({}, req.params, req.query);
    if (req.method === 'POST' || req.method === 'PUT') {
        body = Object.assign(body, req.body);
    }
    const result = await schema.validate(body, {abortEarly: false});
    if (result.error) {
        console.error(result.error);
        res.status(422).send({
            error: result.error,
            message: result.error.message,
            showMessage: false,
        });
    } else {
        next();
    }
};

export const submitCodeSnippet = async(req,res,next)=>{
    const schema = Joi.object({
        username : Joi.string().required(),
        code_language : Joi.string().allow(
            'C++',
            'Java',
            'JavaScript', 
            'Python'
        ),
        stdin : Joi.string().allow(''),
        source_code : Joi.string().required()
    })
    await validate(schema,req,res,next);
}