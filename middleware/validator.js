import Main from "../models";
import { ValidationError } from "../errors";

const validators = {
  Main: {
    scopes: {
      post: Main.PostValidationSchema,
    },
  },
};

function scopeExists(validator, scope) {
  return (
    typeof Object.keys(validator.scopes).find((key) => key === scope) !==
    "undefined"
  );
}

function getSchema(model, scope) {
  const validator = validators[model];
  if (!validator) {
    throw new Error("Validator does not exist");
  }

  if (validator.scopes) {
    if (scope) {
      if (!scopeExists(validator, scope)) {
        throw new Error(`Scope ${scope} does not exist in ${model} validator`);
      } else {
        return validator.scopes[scope];
      }
    } else {
      return validator.scopes.default;
    }
  } else {
    return validator;
  }
}

function validate(model, object, scope) {
  const schema = getSchema(model, scope);
  return schema.validate(object, {
    allowUnknown: true,
  });
}

export default function ValidationMiddleware(model, scope) {
  return (req, res, next) => {
    const validationResult = validate(model, req.body, scope);
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.message, model);
    } else {
      next();
    }
  };
}
