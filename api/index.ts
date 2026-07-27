import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

let app: any;

async function createApp() {
  const server = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );

  await nestApp.init();

  return server;
}

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await createApp();
  }
  return app(req, res);
}