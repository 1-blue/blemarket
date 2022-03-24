import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (!req.session.user?.id)
    return res.status(401).json({ ok: false, message: "비로그인 상태입니다." });

  try {
    const exUser = await prisma.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    res.status(200).json({
      ok: true,
      message: "로그인 인증 완료",
      user: exUser,
    });
  } catch (error) {
    console.error("/api/users/me error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler("GET", handler));
