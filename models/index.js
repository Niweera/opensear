import Joi from "joi";

const PostValidationSchema = Joi.object({
  for_user_id: Joi.string().required(),
});

export default {
  PostValidationSchema,
};
