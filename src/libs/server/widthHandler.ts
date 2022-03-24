import { NextApiRequest, NextApiResponse } from "next";

type methodType = "GET" | "POST" | "DELETE";
type fnType = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;

export interface IResponseType {
  ok: boolean;
  message: string;
  [key: string]: any;
}

// 2022/03/21 - method에 따른 라우팅을 쉽게 처리해주는 HOF - by 1-blue
const withHandler =
  (method: methodType, fn: fnType) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) return res.status(405).end();

    try {
      await fn(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };

export default withHandler;
