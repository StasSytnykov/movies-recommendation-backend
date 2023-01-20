import { Request } from "express";

export interface Context {
  locale: string;
}

export const context = ({ req }: { req: Request }): Context =>
  <Context>{
    locale: req?.headers?.locale || "en-US",
  };
