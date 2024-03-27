import { CustomRequest } from '../../../middleware/auth';
import { pinValidation } from '../../../utils/validators/joi'
import { User } from '../../../entities/user.entity';
import datasource from '../../../datasource';
import { Response } from 'express';
import { UserService } from '../../../services/api/v1/user.service';

export class UserController {
  static async createTransactionPin(req: CustomRequest, res: Response) {
    const pin = req.body
    const LoggedUser = req.user!;

    try {
      //validate pin
      const { error } = pinValidation(pin);
      if (error) {
        return res.status(400).send({
          message: error.details[0].message
        });
      }
      //check if user has a transaction pin
      const user = await UserService.getUserByEmail(LoggedUser.email);

      if (user?.transactionPin) {
        return res.status(400).send({
          message: "User already has a transaction pin"
        });
      }

      //create transaction pin
      const createdPin = await UserService.createTransactionPin(user!, pin.pin);

      return res.status(201).send({
        message: "Transaction pin created successfully",
        data: createdPin
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      })
    }
  }
}