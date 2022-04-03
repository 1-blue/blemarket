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

  try {
    const postWithAnswer = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            recommendations: true,
          },
        },
      },
    });
    if (!postWithAnswer)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 게시글을 요청했습니다.",
      });

    const isRecommendation = await prisma.recommendation.findFirst({
      where: {
        postId,
        userId: req.session.user?.id,
      },
      select: {
        id: true,
      },
    });
    const answerCount = await prisma.answer.count({
      where: {
        postId,
      },
    });

    res.status(200).json({
      ok: true,
      message: "특정 게시글을 가져왔습니다.",
      post: postWithAnswer,
      isRecommendation: !!isRecommendation,
      answerCount,
    });
  } catch (error) {
    console.error("/api/posts/[id] error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
