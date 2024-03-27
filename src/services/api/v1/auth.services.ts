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
        const savedUser = await EntityManager.save(user);
        const savedWallet = await EntityManager.save(wallet);
        return { savedUser, savedWallet };
      });
      //send mail
      const mailOptions: IMailOptions = {
        message: "Welcome to our platform",
        email: data.savedUser.email,
        subject: "Welcome",
      }
      sendMail(mailOptions)
      return data
    } catch (error) {
      throw error;
    }
  }

  static async login(data: ILoginData) {

  }
}