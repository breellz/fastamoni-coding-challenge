import datasource from "../../../datasource";
import { User, IUser } from "../../../entities/user.entity";
import { TransactionPin, ITransactionPin } from "../../../entities/transactionPin.entity";
import { Donation } from "../../../entities/donation.entity";
import { Transaction, TransactionType } from "../../../entities/transaction.entity";
import { Wallet } from "../../../entities/wallet.entity";
import { Between } from "typeorm";
export interface IDonationFilter {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  page?: number;
}
export class UserService {
  static async getUserByEmail(email: string) {
    const userRepo = datasource.getRepository(User);
    try {
      const user = await userRepo.findOne({
        where: {
          email
        }, relations: [
          'transactionPin',
          'wallet']
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
        }, relations: [
          'transactionPin',
          'wallet',]
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

  static async createDonation(donor: User, beneficiary: User, amount: number, message?: string) {
    try {
      const donation = new Donation();
      donation.amount = amount;
      donation.donor = donor;
      donation.beneficiary = beneficiary;
      donation.message = message ? message : "";
      //credit beneficiary wallet
      beneficiary.wallet.balance += amount;
      //debit donor wallet
      donor.wallet.balance -= amount;

      //make it transactional to avoid race conditions
      const data = await datasource.manager.transaction(async transactionalEntityManager => {
        const savedDonation = await transactionalEntityManager.save(donation);
        // Save donor.wallet and beneficiary.wallet in a single operation
        await transactionalEntityManager.save([donor.wallet, beneficiary.wallet]);

        return {
          donation: savedDonation
        }
      });
      return data
    } catch (error) {
      throw error
    }
  }

  static async getUserDonations(user: User, filters: IDonationFilter) {
    let { startDate, endDate, limit, page } = filters;
    limit = limit ? limit : 10;
    page = page ? page : 1;

    const skip = (page - 1) * limit;

    let end = endDate ? new Date(endDate) : new Date();
    if (!endDate) {
      end.setHours(23, 59, 59, 999);
    } else {
      end.setDate(end.getDate() + 1);
    }

    const start = startDate ? new Date(startDate) : new Date('1970-01-01');

    try {
      const donations = await datasource.createQueryBuilder(Donation, "donation")
        .leftJoinAndSelect("donation.beneficiary", "beneficiary")
        .leftJoinAndSelect("donation.donor", "donor")
        .where("(donation.donor.ID = :userId OR donation.beneficiary.ID = :userId) AND donation.createdAt BETWEEN :start AND :end", { userId: user.ID, start, end })
        .orderBy("donation.createdAt", "DESC")
        .skip(skip)
        .take(limit)
        .getMany();

      const totalCount = await datasource.createQueryBuilder(Donation, "donation")
        .where("(donation.donor.ID = :userId OR donation.beneficiary.ID = :userId) AND donation.createdAt BETWEEN :start AND :end", { userId: user.ID, start, end })
        .getCount();

      const totalPages = Math.ceil(totalCount / limit);


      return {
        totalCount,
        totalPages,
        donations
      };
    } catch (error) {
      throw error;
    }
  }

  static async createWalletTransaction(wallet: Wallet, amount: number, type: TransactionType) {
    const transactionRepo = datasource.getRepository(Transaction);
    try {
      const transaction = new Transaction();
      transaction.amount = amount;
      transaction.type = type;
      transaction.wallet = wallet;
      transaction.description = TransactionType.CREDIT === type ? "Donation credit" : "Donation debit";
      await transactionRepo.save(transaction);

    } catch (error) {
      throw error
    }
  }

  static async getDonationById(user: User, donationID: number) {
    const donationRepo = datasource.getRepository(Donation);
    try {
      const donation = await donationRepo.findOne({
        where: [
          { ID: donationID, donor: { ID: user.ID } },
          { ID: donationID, beneficiary: { ID: user.ID } }
        ],
        relations: ['donor', 'beneficiary']
      });
      return donation
    } catch (error) {
      throw error
    }
  }

  static async getUserDonationCount(user: User) {
    try {
      const count = await datasource.createQueryBuilder(Donation, "donation")
        .where("donation.donor.ID = :donorId", { donorId: user.ID })
        .getCount();
      return count
    } catch (error) {
      throw error
    }
  }
}