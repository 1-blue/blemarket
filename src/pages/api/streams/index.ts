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
  const {
    session: { user },
    method,
  } = req;

  try {
    // 스트림 가져오기
    if (method === "GET") {
      const streams = await prisma.stream.findMany({
        select: {
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      res.status(200).json({
        ok: true,
        message: "스트림들을 가져왔습니다.",
        streams,
      });
    }
    // 스트림 생성
    else if (method === "POST") {
      const { title, price, description } = req.body;

      const createdStream = await prisma.stream.create({
        data: {
          title,
          price,
          description,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

      res.status(201).json({
        ok: true,
        message: "스트림을 생성했습니다.",
        stream: createdStream,
      });
    }
  } catch (error) {
    console.error("/api/streams error >> ", error);

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
