import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { Request, Response } from "express";

let app: any;

async function createApp() {
  const server = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );

  nestApp.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  await nestApp.init();

  return server;
}

export default async function handler(
  req: Request,
  res: Response
) {
  if (!app) {
    app = await createApp();
  }

  return app(req, res);
}