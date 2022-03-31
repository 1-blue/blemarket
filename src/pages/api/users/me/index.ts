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
    method,
  } = req;

  try {
    if (method === "GET") {
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
    }

    if (method === "POST") {
      const name = req.body.name as string;
      const email = req.body.email as string;
      const phone = req.body.phone as string;

      const exUser = await prisma.user.findUnique({
        where: {
          id: req.session.user?.id,
        },
      });

      // 이름 변경
      if (name && exUser?.name !== name) {
        const isOverlapName = await prisma.user.findFirst({
          where: {
            AND: {
              NOT: {
                id: user?.id,
              },
              name,
            },
          },
        });

        if (isOverlapName)
          return res.status(409).json({
            ok: false,
            message: "이미 사용중인 이름입니다.",
          });

        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            name,
          },
        });
      }

      // 이메일 변경
      if (email && exUser?.email !== email) {
        const isOverlapEmail = await prisma.user.findFirst({
          where: {
            AND: {
              NOT: {
                id: user?.id,
              },
              email,
            },
          },
        });

        if (isOverlapEmail)
          return res.status(409).json({
            ok: false,
            message: "이미 사용중인 이메일입니다.",
          });

        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            email,
          },
        });
      }

      // 휴대폰번호 변경
      if (phone && exUser?.phone !== phone) {
        const isOverlapPhone = await prisma.user.findFirst({
          where: {
            AND: {
              NOT: {
                id: user?.id,
              },
              phone,
            },
          },
        });

        if (isOverlapPhone)
          return res.status(409).json({
            ok: false,
            message: "이미 사용중인 전화번호입니다.",
          });

        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            phone,
          },
        });
      }

      res.status(200).json({
        ok: true,
        message: "정보를 변경했습니다.",
      });
    }
  } catch (error) {
    console.error("/api/users/me error >> ", error);

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
