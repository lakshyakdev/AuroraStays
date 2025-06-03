const Joi = require('joi');

module.exports.staySchema = Joi.object({
    stay : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required(),
        comment : Joi.string().required(),
    }).required()
})