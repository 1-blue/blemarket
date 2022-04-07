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
  const productId = +req.query.id;
  const userId = +req.session.user?.id!;

  try {
    const findProductWithUser = await prisma.product.findUnique({
      where: { id: productId },
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

    const keywords = findProductWithUser?.keywords.split(" ");
    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: keywords?.map((keyword) => ({
          keywords: {
            contains: keyword,
          },
        })),
        AND: {
          id: {
            not: productId,
          },
        },
      },
      take: 8,
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({
      ok: true,
      message: "특정 상품에 대한 정보를 가져왔습니다.",
      product: findProductWithUser,
      relatedProducts,
    });
  } catch (error) {
    console.error("/api/products/[id] error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
