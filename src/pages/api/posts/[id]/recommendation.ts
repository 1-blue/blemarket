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
  const {
    method,
    session: { user },
  } = req;

  try {
    const exPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!exPost)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 게시글입니다.",
      });

    // 궁금해요 정보 요청
    if (method === "GET") {
      const isRecommendationPromise = prisma.recommendation.findFirst({
        where: {
          postId,
          userId: req.session.user?.id,
        },
        select: {
          id: true,
        },
      });
      const recommendationCountPromise = prisma.recommendation.count({
        where: {
          postId,
        },
      });

      const [isRecommendation, recommendationCount] = await Promise.all([
        isRecommendationPromise,
        recommendationCountPromise,
      ]);

      return res.status(200).json({
        ok: true,
        message: "해당 게시글의 궁금해요에 대한 정보를 가져왔습니다.",
        isRecommendation,
        recommendationCount,
      });
    }
    // 궁금해요 추가
    else {
      const exRecommendation = await prisma.recommendation.findFirst({
        where: {
          postId,
          userId: user?.id,
        },
      });

      if (method === "POST") {
        if (exRecommendation)
          return res.status(409).json({
            ok: false,
            message: "이미 궁금해요를 누른 게시글입니다.",
          });

        await prisma.recommendation.create({
          data: {
            user: { connect: { id: user?.id } },
            post: { connect: { id: postId } },
          },
        });
      }
      // 궁금해요 취소
      else if (method === "DELETE") {
        if (!exRecommendation)
          return res.status(409).json({
            ok: false,
            message: "궁금해요를 누르지 않은 게시글입니다.",
          });

        await prisma.recommendation.delete({
          where: {
            id: exRecommendation?.id,
          },
        });
      }
    }

    return res.status(200).json({
      ok: true,
      message:
        method === "POST"
          ? "해당 게시글에 궁금해요를 눌렀습니다."
          : "해당 게시글에 궁금해요를 취소했습니다.",
    });
  } catch (error) {
    console.error("/api/posts/[id]/recommendation error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST", "DELETE"], handler })
);
