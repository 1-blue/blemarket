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
  const userId = req.session.user?.id;
  const streamId = +req.query.id;

  try {
    const exStream = await prisma.stream.findUnique({
      where: {
        id: streamId,
      },
    });
    if (!exStream)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않은 스트림에 메시지 관련 요청을 했습니다.",
      });

    // 메시지 가져오기
    if (req.method === "GET") {
      const page = +req.query.page;
      const offset = +req.query.offset;

      const messages = await prisma.message.findMany({
        take: offset,
        skip: page * offset,
        where: {
          streamId,
        },
        select: {
          id: true,
          message: true,
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
            createdAt: "asc",
          },
        ],
      });

      res.status(200).json({
        ok: true,
        message: "메시지들을 가져왔습니다.",
        messages,
      });
    }
    // 메시지 생성
    else if (req.method === "POST") {
      const { message } = req.body;

      const createdMessage = await prisma.message.create({
        data: {
          message,
          stream: {
            connect: {
              id: streamId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      res.status(201).json({
        ok: true,
        message: "메시지를 생성했습니다.",
        createdMessage,
      });
    }
  } catch (error) {
    console.error("/api/streams/[id]/messages error >> ", error);

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
