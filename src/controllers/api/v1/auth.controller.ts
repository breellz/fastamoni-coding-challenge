import { Request, Response } from "express";
import { AuthServices } from "../../../services/api/v1/auth.services";
import { UserService } from "../../../services/api/v1/user.service";
import { RegistrationValidation, loginValidation } from "../../../utils/validators/joi";

export class AuthController {
  static async SignUp(req: Request, res: Response) {
    const { email, username, password } = req.body;
    try {
      //validate with joi
      const { error } = RegistrationValidation({ email, username, password });
      if (error) {
        return res.status(400).send({
          message: error.details[0].message
        });
      }
      //check if user exists
      const userExists = await UserService.getUserByEmail(email);
      if (userExists) {
        return res.status(400).send({
          message: "User already exists with that email"
        });
      }
      //check if username exists
      const usernameExists = await UserService.getUserByUsername(username);
      if (usernameExists) {
        return res.status(400).send({
          message: "Username already exists"
        });
      }
      const data = await AuthServices.signUp({ email, username, password });

      return res.status(201).send({
        message: "User created successfully",
        data
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({
        message: error.message
      })
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { error } = loginValidation({ email, password });
      if (error) {
        return res.status(400).send({
          message: error.details[0].message
        });
      }
      //check if user exists and don't expose which one doesn't exist, making it difficult for attackers
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(400).send({
          message: "Invalid username or password"
        });
      }
      //check if password is correct
      const isPasswordValid = await user.checkIfPlainPasswordIsValid(password);
      if (!isPasswordValid) {
        return res.status(400).send({
          message: "Invalid username or password"
        });
      }
      //generate token
      const token = user.generateToken()
      return res.status(200).send({
        message: "Login successful",
        token
      });

    } catch (error) {
      return res.status(400).send({
        message: error.message
      })
    }
  }
}