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
    session: { user },
    method,
  } = req;
  const ownerId = +req.body.ownerId;

  try {
    if (method === "GET") {
      const rooms = await prisma.room.findMany({
        where: {
          users: {
            some: {
              id: +user?.id!,
            },
          },
        },
        include: {
          users: {
            where: {
              NOT: {
                id: +user?.id!,
              },
            },
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          // >>> 마지막 메시지만 가져오도록 수정 필요
          chats: {
            select: {
              chat: true,
            },
          },
        },
        // >>> 마지막 메시지가 가장 빠른순으로 정렬하도록 수정 필요
        orderBy: {
          updatedAt: "desc",
        },
      });

      return res.status(201).json({
        ok: true,
        message: "모든 채팅방들을 가져왔습니다.",
        rooms,
      });
    } else if (method === "POST") {
      const title = req.body.title;
      const exRoom = await prisma.room.findUnique({
        where: {
          name: title + user?.id + ownerId,
        },
      });

      // 이미 채팅방이 존재하면
      if (exRoom) {
        return res.status(200).json({
          ok: true,
          message: "이미 채팅방이 존재합니다.",
          roomId: exRoom.id,
        });
      }

      const { id: roomId } = await prisma.room.create({
        data: {
          users: {
            connect: [
              {
                id: +user?.id!,
              },
              {
                id: ownerId,
              },
            ],
          },
          name: title + user?.id + ownerId,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "채팅방을 생성했습니다.",
        roomId,
      });
    }
  } catch (error) {
    console.error("/api/chats/room error >> ", error);

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
