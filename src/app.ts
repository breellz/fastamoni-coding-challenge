import express, { Request, Response } from "express";
import "dotenv/config";
import datasource from './datasource'

export const main = async () => {
  try {
    const app: express.Application = express();

    app.use(express.json());

    await datasource.initialize();
    console.log(`Database connected to ${datasource.options.database}`);

    return app

  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}

