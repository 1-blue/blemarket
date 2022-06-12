import { NextApiResponseServerIO } from "@src/@types/chat";
import { NextApiRequest, NextApiResponse } from "next";

type Methods = "GET" | "POST" | "DELETE" | "PATCH";

interface IConfig {
  methods: Methods[];
  handler: (
    req: NextApiRequest,
    res: NextApiResponse & NextApiResponseServerIO
  ) => Promise<any>;
  isPrivate?: boolean;
}

export interface IResponseType {
  ok: boolean;
  message: string;
  [key: string]: any;
}

// 2022/03/25 - method에 따른 라우팅을 쉽게 처리해주는 HOF + 접근 권한 확인 - by 1-blue
const withHandler =
  ({ methods, handler, isPrivate = true }: IConfig) =>
  async (
    req: NextApiRequest,
    res: NextApiResponse & NextApiResponseServerIO
  ) => {
    if (!methods.includes(req.method as Methods)) return res.status(405).end();

    if (isPrivate && !req.session.user)
      return res
        .status(200)
        .json({ ok: false, message: "비로그인 상태입니다." });

    try {
      await handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };

export default withHandler;
