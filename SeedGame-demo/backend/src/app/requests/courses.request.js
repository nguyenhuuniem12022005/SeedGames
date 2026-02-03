import Joi from 'joi';

export const createCourse = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().label('Title'),
  subtitle: Joi.string().trim().optional().allow(null, '').label('Subtitle'),
  description: Joi.string().optional().allow(null, '').label('Description'),
  level: Joi.string().valid('Beginner','Intermediate','Advanced').optional().label('Level'),
  duration: Joi.string().optional().allow(null, '').label('Duration'),
  rating: Joi.number().min(0).max(5).optional().label('Rating'),
  totalRatings: Joi.number().integer().min(0).optional().label('Total Ratings'),
  price: Joi.number().precision(2).optional().label('Price'),
  originalPrice: Joi.number().precision(2).optional().label('Original Price'),
  image: Joi.string().uri().optional().allow(null, '').label('Image URL'),
  is_published: Joi.boolean().optional().label('Published')
});

export const updateCourse = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional().label('Title'),
  subtitle: Joi.string().trim().optional().allow(null, '').label('Subtitle'),
  description: Joi.string().optional().allow(null, '').label('Description'),
  level: Joi.string().valid('Beginner','Intermediate','Advanced').optional().label('Level'),
  duration: Joi.string().optional().allow(null, '').label('Duration'),
  rating: Joi.number().min(0).max(5).optional().label('Rating'),
  total_ratings: Joi.number().integer().min(0).optional().label('Total Ratings'),
  price: Joi.number().precision(2).optional().label('Price'),
  original_price: Joi.number().precision(2).optional().label('Original Price'),
  image: Joi.string().uri().optional().allow(null, '').label('Image URL'),
  is_published: Joi.boolean().optional().label('Published')
});
