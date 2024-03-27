import { Router } from 'express'
import { AuthController } from '../../../controllers/api/v1/auth.controller'

export const AuthRouter = Router()

AuthRouter.post('/signUp', AuthController.SignUp)
AuthRouter.post('/login', AuthController.login)