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
      // >>> 채팅방 페이지네이션 필요하다면 코드 작성할 곳
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
