import { NextApiRequest, NextApiResponse } from "next";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const productId = +req.query.id;
  const {
    session: { user },
    method,
  } = req;

  try {
    const exProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!exProduct)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 상품에 댓글처리를 시도했습니다.",
      });

    if (method === "GET") {
      const page = +req.query.page;
      const offset = +req.query.offset;

      const answers = await prisma.answer.findMany({
        take: offset,
        skip: page * offset,
        where: {
          productId,
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
            createdAt: "asc",
          },
        ],
      });

      return res.status(201).json({
        ok: true,
        message: "답변들을 가져왔습니다.",
        answers,
      });
    } else if (method === "POST") {
      const { answer } = req.body;

      await prisma.answer.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
          answer,
        },
      });

      return res.status(201).json({
        ok: true,
        message: "답변을 생성했습니다.",
      });
    } else if (method === "DELETE") {
      const answerId = Number(req.query.answerId);

      await prisma.answer.delete({
        where: {
          id: answerId,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "답변을 성공적으로 제거했습니다.",
      });
    }
  } catch (error) {
    console.error("/api/products/[id]/answer error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST", "DELETE"], handler })
);
