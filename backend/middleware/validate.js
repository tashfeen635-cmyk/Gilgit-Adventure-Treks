const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ message: messages });
    }
    next();
  };
}

const schemas = {
  booking: Joi.object({
    destination: Joi.string().trim().required(),
    region: Joi.string().trim().allow(''),
    checkIn: Joi.string().trim().allow(''),
    checkOut: Joi.string().trim().allow(''),
    adults: Joi.number().integer().min(1).max(50).required(),
    children: Joi.number().integer().min(0).max(50).default(0),
    infants: Joi.number().integer().min(0).max(20).default(0),
    totalPrice: Joi.number().min(0).default(0),
    customerName: Joi.string().trim().min(2).max(100).required(),
    customerEmail: Joi.string().trim().email().required(),
    customerPhone: Joi.string().trim().max(20).allow(''),
    reference: Joi.string().trim().required(),
    specialRequests: Joi.string().trim().max(1000).allow('')
  }),

  contact: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string().trim().max(20).allow(''),
    subject: Joi.string().trim().min(2).max(200).required(),
    message: Joi.string().trim().min(5).max(5000).required()
  }),

  subscriber: Joi.object({
    email: Joi.string().trim().email().required(),
    name: Joi.string().trim().max(100).allow('')
  }),

  userReview: Joi.object({
    destination: Joi.string().trim().required(),
    rating: Joi.number().min(1).max(5).required(),
    text: Joi.string().trim().min(5).max(2000).required()
  })
};

module.exports = { validate, schemas };
