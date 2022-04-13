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
    method,
    session: { user },
  } = req;
  const roomId = +req.query.id;
  try {
    if (method === "GET") {
      const page = +req.query.page;
      const offset = +req.query.offset;

      const chats = await prisma.chat.findMany({
        take: offset,
        skip: page * offset,
        where: {
          roomId,
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      // 현재 채팅방에 접근권한 확인
      const isMine = await prisma.user.findFirst({
        where: {
          AND: {
            id: +user?.id!,
            rooms: {
              some: {
                id: roomId,
              },
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        message: "모든 메시지를 가져왔습니다.",
        chats,
        isMine: !!isMine,
      });
    } else if (method === "POST") {
      const chat = req.body.chat;
      const createdChat = await prisma.chat.create({
        data: {
          chat,
          User: {
            connect: {
              id: +user?.id!,
            },
          },
          Room: {
            connect: {
              id: roomId,
            },
          },
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return res.status(201).json({
        ok: true,
        message: "채팅 생성 성공!",
        createdChat,
      });
    }
  } catch (error) {
    console.error("/api/chats/[id] error >> ", error);

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