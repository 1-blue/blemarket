import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "blemarket-session",
  password: process.env.COOKIE_SECRET!,
};

export const withApiSession = (fn: any) =>
  withIronSessionApiRoute(fn, cookieOptions);
