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
  const { token } = req.body;

  try {
    const exToken = await prisma.token.findUnique({
      where: {
        payload: token,
      },
    });

    if (!exToken)
      return res
        .status(404)
        .json({ ok: false, message: "유효하지 않은 토큰입니다." });

    req.session.user = { id: exToken.userId };
    await req.session.save();
    await prisma.token.deleteMany({ where: { userId: exToken.userId } });

    res.status(200).json({
      ok: true,
      message: "이메일/전화번호 인증을 성공했습니다.",
      token,
    });
  } catch (error) {
    console.error("/api/users/confirm error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ method: "POST", handler, isPrivate: false })
);
