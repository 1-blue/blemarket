import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

// type
import { RECORD } from "@src/types";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { kinds },
    session: { user },
  } = req;

  try {
    // 관심, 판매, 구매 상품 요청
    if (kinds) {
      switch (kinds) {
        case RECORD.FAVORITE:
          const exFavoriteProducts = await prisma.record.findMany({
            where: {
              kinds: "Favorite",
              userId: user?.id,
            },
            select: {
              id: true,
              updatedAt: true,
              product: {
                include: {
                  records: {
                    where: {
                      kinds: "Favorite",
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
                  },
                },
              },
            },
          });
          return res.status(200).json({
            ok: true,
            message: "관심있는 상품들에 대한 정보입니다.",
            products: exFavoriteProducts,
          });
        case RECORD.SALE:
          const exSaleProducts = await prisma.record.findMany({
            where: {
              kinds: "Sale",
              userId: user?.id,
            },
            select: {
              id: true,
              updatedAt: true,
              product: {
                include: {
                  records: {
                    where: {
                      kinds: "Favorite",
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
                  },
                },
              },
            },
          });
          return res.status(200).json({
            ok: true,
            message: "판매한 상품들에 대한 정보입니다.",
            products: exSaleProducts,
          });
        case RECORD.PURCHASE:
          const exPurchaseProducts = await prisma.record.findMany({
            where: {
              kinds: "Purchase",
              userId: user?.id,
            },
            select: {
              id: true,
              updatedAt: true,
              product: {
                include: {
                  records: {
                    where: {
                      kinds: "Favorite",
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
                  },
                },
              },
            },
          });
          return res.status(200).json({
            ok: true,
            message: "구매한 상품들에 대한 정보입니다.",
            products: exPurchaseProducts,
          });

        default:
          break;
      }
    }

    const exUser = await prisma.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    res.status(200).json({
      ok: true,
      message: "로그인된 유저의 정보입니다.",
      user: exUser,
    });
  } catch (error) {
    console.error("/api/users/me error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
