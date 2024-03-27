import datasource from "../../../datasource";
import { User, IUser } from "../../../entities/user.entity";
import { TransactionPin, ITransactionPin } from "../../../entities/transactionPin.entity";
export class UserService {
  static async getUserByEmail(email: string) {
    const userRepo = datasource.getRepository(User);
    try {
      const user = await userRepo.findOne({
        where: {
          email
        }, relations: [
          'transactionPin',
          'wallet',
          'userDonations',
          'receivedDonations']
      });

      return user
    } catch (error) {
      throw error
    }
  }
  static async getUserByUsername(username: string) {

    const userRepo = datasource.getRepository(User);
    try {
      const user = await userRepo.findOne({
        where: {
          username
        }
      });

      return user
    } catch (error) {
      throw error
    }
  }

  static async createTransactionPin(user: User, pin: string) {
    const pinRepo = datasource.getRepository(TransactionPin);
    try {
      const transactionPin = new TransactionPin();
      transactionPin.pin = pin;
      await pinRepo.save(transactionPin);
      user.transactionPin = transactionPin
      await datasource.getRepository(User).save(user)
      return transactionPin

    } catch (error) {
      console.log(error)
      throw error
    }
  }
}