import { Router } from 'express'
import { UserController } from '../../../controllers/api/v1/user.controller'
import { Auth } from '../../../middleware/auth'

export const UserRouter = Router()

UserRouter.post('/transaction-pin', Auth, UserController.createTransactionPin)
UserRouter.post('/donate', Auth, UserController.createDonation)
UserRouter.get('/donations', Auth, UserController.getUserDonations)
UserRouter.get('/donations/:donationID', Auth, UserController.getDonation)