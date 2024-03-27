import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { AuthRouter } from "./routers/api/v1/auth.route";
import { UserRouter } from "./routers/api/v1/user.route";
import { createBeneficiaryUser } from "./utils/init";

import datasource from './datasource'

export const main = async () => {
  try {
    const app: express.Application = express();

    app.use(express.json());
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request made to ${req.url}`);
      next();
    })
    app.get("/api/v1", (req: Request, res: Response) => {
      res.send("Hello World!");
    });
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/user", UserRouter);

    await datasource.initialize();
    console.log(`Database connected to ${datasource.options.database}`);
    createBeneficiaryUser();
    return app

  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}

