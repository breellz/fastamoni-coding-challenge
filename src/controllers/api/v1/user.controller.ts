import { Response } from 'express';
import { CustomRequest } from '../../../middleware/auth';
import { IDonationFilter, UserService } from '../../../services/api/v1/user.service';
import { pinValidation, donationValidation, donationFilterValidation } from '../../../utils/validators/joi';
import { TransactionType } from '../../../entities/transaction.entity';
import { sendMail, IMailOptions } from "../../../utils/mailer";
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

  static async createDonation(req: CustomRequest, res: Response) {
    const { amount, beneficiaryUsername, message, transactionPin } = req.body;
    try {
      const { error } = donationValidation({ amount, beneficiaryUsername, transactionPin, message, });
      if (error) {
        return res.status(400).send({
          message: error.details[0].message
        });
      }
      const user = await UserService.getUserByEmail(req.user!.email);
      //validate transaction pin
      if (!user?.transactionPin) {
        return res.status(400).send({
          message: "Please create a transaction pin"
        });
      }
      const isValidPin = await user.transactionPin.checkIfPinIsValid(transactionPin);
      if (!isValidPin) {
        return res.status(400).send({
          message: "Invalid transaction pin"
        });
      }
      const beneficiary = await UserService.getUserByUsername(beneficiaryUsername);
      if (!beneficiary) {
        return res.status(404).send({
          message: "Beneficiary not found"
        })
      }
      if (beneficiary.email === user.email) {
        return res.status(400).send({
          message: "You can't donate to yourself"
        })
      }
      //create donation
      const { donation, wallet } = await UserService.createDonation(user!, beneficiary, amount, message);
      //create wallet transactions for user and beneficicary
      await UserService.createWalletTransaction(user.wallet, amount, TransactionType.DEBIT);
      await UserService.createWalletTransaction(beneficiary.wallet, amount, TransactionType.CREDIT);
      // Get the count of the user's donations
      const donationCount = await UserService.getUserDonationCount(user);

      // If the user has made two or more donations, send a thank you message

      if (donationCount >= 2) {
        //send mail
        const mailOptions: IMailOptions = {
          message: "Thank you for making a donation, we really appreciate your kindness.",
          email: user.email,
          subject: "Thank you for your donation",
        }
        sendMail(mailOptions)
      }
      return res.status(201).send({
        message: "Donation created successfully",
        data: {
          donation,
          wallet
        }
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      })
    }
  }

  static async getUserDonations(req: CustomRequest, res: Response) {
    let { limit, page, startDate, endDate }: IDonationFilter = req.query;

    try {
      const { error } = donationFilterValidation({ limit, page, startDate, endDate });
      if (error) {
        return res.status(400).send({
          message: error.details[0].message
        });
      }
      const user = await UserService.getUserByEmail(req.user!.email);
      if (!user) {
        return res.status(404).send({
          message: "User not found"
        });
      }

      const response = await UserService.getUserDonations(user, { startDate, endDate, limit, page, });
      return res.status(200).send({
        message: "User donations fetched",
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        GivenDonations: response.totalDonationsGiven,
        ReceivedDonations: response.totalDonationsReceived,
        givenDonationsList: response.givenDonations,
        receivedDonationsList: response.receivedDonations
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }

  static async getDonation(req: CustomRequest, res: Response) {
    const { donationID } = req.params;
    try {
      const donation = await UserService.getDonationById(req.user!, parseInt(donationID));
      if (!donation) {
        return res.status(404).send({
          message: "Donation not found or does not belong to user"
        });
      }
      return res.status(200).send({
        message: "Donation fetched",
        data: donation
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }
}