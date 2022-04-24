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
              id: user?.id,
            },
          },
        },
        include: {
          users: {
            where: {
              NOT: {
                id: user?.id,
              },
            },
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      // 방들의 마지막 채팅만 추출하고 시간순 정렬
      const chatPromises = rooms.map((room) =>
        prisma.chat.findMany({
          take: 1,
          where: {
            roomId: room.id,
          },
          select: {
            chat: true,
            updatedAt: true,
            roomId: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        })
      );
      const roomsOfLastChat = (await Promise.all(chatPromises)).flat(1);
      roomsOfLastChat.sort((x, y) => (+x.updatedAt > +y.updatedAt ? -1 : 1));

      // 마지막 채팅을 기준으로 방들을 정렬
      const sortRooms = roomsOfLastChat.map((chat) =>
        rooms.find((room) => room.id === chat.roomId)
      );

      return res.status(200).json({
        ok: true,
        message: "모든 채팅방을 가져왔습니다.",
        rooms: sortRooms,
        roomsOfLastChat: roomsOfLastChat,
      });
    } else if (method === "POST") {
      const title = req.body.title;
      const productId = +req.body.productId;
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
          Product: {
            connect: {
              id: productId,
            },
          },
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
