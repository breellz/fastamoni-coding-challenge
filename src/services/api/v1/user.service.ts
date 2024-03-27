import datasource from "../../../datasource";
import { User } from "../../../entities/user.entity";

export class UserService {
  static async getUserByEmail(email: string) {
    const userRepo = datasource.getRepository(User);
    try {
      const user = await userRepo.findOne({
        where: {
          email
        }
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
}