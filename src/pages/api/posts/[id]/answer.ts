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
    session: { user },
    method,
  } = req;

  try {
    const exPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (method === "GET") {
      if (!exPost)
        return res.status(404).json({
          ok: false,
          message: "존재하지 않는 게시글에 댓글들을 요청했습니다.",
        });

      const page = +req.query.page;
      const offset = +req.query.offset;

      const answers = await prisma.answer.findMany({
        take: offset,
        skip: page * offset,
        where: {
          postId,
        },
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
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      return res.status(201).json({
        ok: true,
        message: "답변들을 가져왔습니다.",
        answers,
      });
    } else if (method === "POST") {
      if (!exPost)
        return res.status(404).json({
          ok: false,
          message: "존재하지 않는 게시글에 댓글을 달았습니다.",
        });

      const { answer } = req.body;

      await prisma.answer.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
          answer,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "답변을 생성했습니다.",
      });
    }
  } catch (error) {
    console.error("/api/posts/[id]/answer error >> ", error);

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
