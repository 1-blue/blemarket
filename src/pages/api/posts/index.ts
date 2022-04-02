import { NextApiRequest, NextApiResponse } from "next";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user },
    method,
  } = req;

  try {
    if (method === "GET") {
      const page = +req.query.page - 1;
      const offset = +req.query.offset;

      let where = {};
      // 인근 게시글 검색 시 실행
      if (req.query.distance) {
        const distance = +req.query.distance;
        const parsedLatitude = parseFloat(req.query.latitude.toString());
        const parsedLongitue = parseFloat(req.query.longitude.toString());

        where = {
          latitude: {
            gte: parsedLatitude - 0.008 * distance,
            lte: parsedLatitude + 0.008 * distance,
          },
          longitude: {
            gte: parsedLongitue - 0.008 * distance,
            lte: parsedLongitue + 0.008 * distance,
          },
        };
      }

      const posts = await prisma.post.findMany({
        take: offset,
        skip: page * offset,
        where,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              answers: true,
              recommendations: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      const postCount = await prisma.post.count({
        where,
      });

      res.status(200).json({
        ok: true,
        message: "게시글들을 가져왔습니다.",
        posts,
        postCount,
      });
    } else if (method === "POST") {
      const createdPost = await prisma.post.create({
        data: {
          question,
          latitude,
          longitude,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

      res.status(201).json({
        ok: true,
        message: "새로운 질문을 생성했습니다.",
        post: createdPost,
      });
    }
  } catch (error) {
    console.error("/api/posts error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
