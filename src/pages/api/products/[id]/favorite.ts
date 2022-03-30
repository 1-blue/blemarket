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
  const { user } = req.session;
  const productId = +req.query.id;
  const { method } = req;

  try {
    const exProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // 존재하지 않는 상품에 좋아요 요청
    if (!exProduct)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 상품입니다.",
      });

    const exFavorite = await prisma.record.findFirst({
      where: {
        productId,
        userId: user?.id,
        kinds: "Favorite",
      },
    });

    // 좋아요 추가
    if (method === "POST") {
      // 좋아요 누른 상태에서 좋아요 추가 요청
      if (exFavorite)
        return res.status(409).json({
          ok: false,
          message: "이미 좋아요를 눌렀습니다.\n잠시후에 다시 시도해주세요",
        });

      await prisma.record.create({
        data: {
          kinds: "Favorite",
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
        },
      });
    }
    // 좋아요 제거
    else if (method === "DELETE") {
      // 좋아요 누르지 않은 상태에서 좋아요 제거 요청
      if (!exFavorite)
        return res.status(409).json({
          ok: false,
          message:
            "이미 좋아요를 누르지 않은 상태입니다.\n잠시후에 다시 시도해주세요",
        });

      await prisma.record.delete({
        where: {
          id: exFavorite?.id,
        },
      });
    }

    res.status(200).json({
      ok: true,
      message:
        method === "POST" ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.",
    });
  } catch (error) {
    console.error("/api/products error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "DELETE"], handler })
);
