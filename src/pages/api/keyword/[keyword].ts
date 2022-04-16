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
  const keyword = req.query.keyword + "";

  try {
    const keywords = await prisma.keyword.findMany({
      where: {
        keyword: {
          contains: keyword,
        },
      },
      select: {
        keyword: true,
      },
    });

    res.status(200).json({
      ok: true,
      message: "추천 키워드들을 가져왔습니다.",
      keywords,
    });
  } catch (error) {
    console.error("/api/keyword/[keyword] error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
