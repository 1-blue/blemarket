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
  const { message } = req.body;

  try {
    const exStream = await prisma.stream.findUnique({
      where: {
        id: streamId,
      },
    });

    if (!exStream)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않은 스트림에 메시지 생성 요청을 했습니다.",
      });

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

    const messageWithUser = await prisma.message.findUnique({
      where: {
        id: createdMessage.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      ok: true,
      message: "메시지를 생성했습니다.",
      messageWithUser,
    });
  } catch (error) {
    console.error("/api/streams error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
