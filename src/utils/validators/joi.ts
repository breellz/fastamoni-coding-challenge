import Joi from "joi";
import { IRegistrationData, ILoginData } from "../../services/api/v1/auth.services";


const RegistrationValidation = (data: IRegistrationData) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    email: Joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

const loginValidation = (data: ILoginData) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

const pinValidation = (data: { pin: string }) => {
  const schema = Joi.object({
    pin: Joi.string().min(4).required(),
  });
  return schema.validate(data);
}


export { RegistrationValidation, loginValidation, pinValidation };
