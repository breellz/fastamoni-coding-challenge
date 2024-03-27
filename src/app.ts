import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { AuthRouter } from "./routers/api/v1/auth";

import datasource from './datasource'

export const main = async () => {
  try {
    const app: express.Application = express();

    app.use(express.json());
    app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`Request made to ${req.url}`);
      next();
    })

    app.use("/api/v1/auth", AuthRouter);

    await datasource.initialize();
    console.log(`Database connected to ${datasource.options.database}`);

    return app

  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}

