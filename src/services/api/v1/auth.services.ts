import datasource from "../../../datasource";
import { User } from "../../../entities/user.entity";
import { Wallet } from "../../../entities/wallet.entity";
import { sendMail, IMailOptions } from "../../../utils/mailer";

export interface IRegistrationData {
  email: string;
  username: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export class AuthServices {
  static async signUp(data: IRegistrationData) {
    //create user
    const user = new User();
    user.email = data.email;
    user.username = data.username;
    user.password = data.password;

    //create user wallet
    const wallet = new Wallet();
    wallet.user = user;

    try {
      //make user and wallet creation transactional
      const data = await datasource.manager.transaction(async EntityManager => {
        // Save user and wallet in a single operation
        const [savedUser, savedWallet] = await EntityManager.save([user, wallet]);
        return { savedUser, savedWallet };
      });
      return data
    } catch (error) {
      throw error;
    }
  }
}