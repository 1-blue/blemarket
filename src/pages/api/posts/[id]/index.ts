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
    const postWithEtc = await prisma.post.findUnique({
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
        answers: {
          select: {
            id: true,
            answer: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            recommendations: true,
          },
        },
      },
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

    res.status(200).json({
      ok: true,
      message: "특정 게시글을 가져왔습니다.",
      post: postWithEtc,
      isRecommendation: !!isRecommendation,
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
