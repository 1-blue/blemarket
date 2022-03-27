import { NextApiRequest, NextApiResponse } from "next";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const postId = +req.query.id;
  const { user } = req.session;

  try {
    const exRecommendation = await prisma.recommendation.findFirst({
      where: {
        postId,
        userId: user?.id,
      },
    });

    if (exRecommendation) {
      await prisma.recommendation.delete({
        where: {
          id: exRecommendation.id,
        },
      });

      res.status(200).json({
        ok: true,
        message: "해당 게시글에 궁금해요를 눌렀습니다.",
      });
    } else {
      await prisma.recommendation.create({
        data: {
          user: { connect: { id: user?.id } },
          post: { connect: { id: postId } },
        },
      });

      res.status(200).json({
        ok: true,
        message: "해당 게시글에 궁금해요를 취소했습니다.",
      });
    }
  } catch (error) {
    console.error("/api/posts/[id]/recommendation error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
