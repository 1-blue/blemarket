import { NextApiRequest, NextApiResponse } from "next";

type methodType = "GET" | "POST" | "DELETE";
type fnType = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;

interface IConfig {
  method: "GET" | "POST" | "DELETE";
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
  isPrivate?: boolean;
}

export interface IResponseType {
  ok: boolean;
  message: string;
  [key: string]: any;
}

// 2022/03/25 - method에 따른 라우팅을 쉽게 처리해주는 HOF + 접근 권한 확인 - by 1-blue
const withHandler =
  ({ method, handler, isPrivate = true }: IConfig) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== method) return res.status(405).end();

    if (isPrivate && !req.session.user)
      return res
        .status(401)
        .json({ ok: false, message: "비로그인 상태입니다." });

    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };

export default withHandler;
