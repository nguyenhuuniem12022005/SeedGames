import Joi from 'joi';

export const createContest = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().label('Title'),
  start_time: Joi.date().iso().optional().allow(null).label('Start Time'),
  end_time: Joi.date().iso().optional().allow(null).label('End Time')
});

export const updateContest = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional().label('Title'),
  start_time: Joi.date().iso().optional().allow(null).label('Start Time'),
  end_time: Joi.date().iso().optional().allow(null).label('End Time')
});
