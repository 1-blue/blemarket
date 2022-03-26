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

  try {
    const exFavorite = await prisma.favorite.findFirst({
      where: {
        productId,
        userId: user?.id,
      },
    });

    if (exFavorite) {
      await prisma.favorite.delete({
        where: {
          id: exFavorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
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
        },
      });
    }
    res.status(200).json({
      ok: true,
      message: exFavorite ? "좋아요를 취소했습니다." : "좋아요를 눌렀습니다.",
      isFavorite: !!exFavorite,
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

export default withApiSession(withHandler({ methods: ["POST"], handler }));
