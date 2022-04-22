import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

// type
import { RECORD } from "@src/types";
import { KINDS } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { kinds },
  } = req;
  const userId = +req.session.user?.id!;

  try {
    // 구매 상품 요청인 경우
    if (kinds === RECORD.BUY) {
      const products = await prisma.product.findMany({
        where: {
          buyerId: userId,
        },
        include: {
          _count: {
            select: {
              answers: true,
              records: true,
            },
          },
          records: {
            select: {
              kinds: true,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        message: "구매한 상품들을 불러왔습니다.",
        products,
      });
    }

    let where = null;

    switch (kinds) {
      case RECORD.FAVORITE:
        where = {
          userId,
          kinds: KINDS.Favorite,
        };
        break;
      case RECORD.SALE:
        where = {
          userId,
          kinds: KINDS.Sale,
        };
        break;
      case RECORD.PURCHASE:
        where = {
          userId,
          kinds: KINDS.Purchase,
        };
        break;
      default:
        return res.status(405).json({
          ok: false,
          message: "허용되지 않은 요청입니다.",
        });
    }

    const exProductsPromise = prisma.record.findMany({
      where,
      select: {
        id: true,
        updatedAt: true,
        product: {
          include: {
            _count: {
              select: {
                answers: true,
                records: true,
              },
            },
            records: {
              select: {
                kinds: true,
              },
            },
          },
        },
      },
    });

    let reservedProductsPromise = null;

    if (kinds === RECORD.SALE) {
      reservedProductsPromise = prisma.record.findMany({
        where: {
          userId,
          kinds: KINDS.Reserved,
        },
        select: {
          id: true,
          updatedAt: true,
          product: {
            include: {
              _count: {
                select: {
                  answers: true,
                  records: true,
                },
              },
              records: {
                select: {
                  kinds: true,
                },
              },
            },
          },
        },
      });
    }

    const [exProducts, reservedProducts] = await Promise.all([
      exProductsPromise,
      reservedProductsPromise,
    ]);

    return res.status(200).json({
      ok: true,
      message: "특정 상품들에 대한 정보입니다.",
      products: exProducts,
      reservedProducts,
    });
  } catch (error) {
    console.error("/api/users/me/[kinds] error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
