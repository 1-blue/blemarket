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
    body: { answer },
  } = req;

  try {
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

    res.status(200).json({
      ok: true,
      message: "답변을 생성했습니다.",
    });
  } catch (error) {
    console.error("/api/posts/[id]/answer error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
