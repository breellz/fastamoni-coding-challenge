import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User, IUser } from "../entities/user.entity";
import datasource from "../datasource";

export interface CustomRequest extends Request {
  user?: IUser;
}

export const Auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userRepo = datasource.getRepository(User);

    const user: IUser | null = await userRepo.findOne({
      where: { ID: (decoded as any).ID }
    });

    if (!user) {
      throw new Error("User profile not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication required" })
  }

};