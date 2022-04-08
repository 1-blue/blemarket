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
    session: { user },
  } = req;

  try {
    let where = null;

    switch (kinds) {
      case RECORD.FAVORITE:
        where = {
          userId: user?.id,
          kinds: KINDS.Favorite,
        };
        break;
      case RECORD.SALE:
        where = {
          userId: user?.id,
          kinds: KINDS.Sale,
        };
        break;
      case RECORD.PURCHASE:
        where = {
          userId: user?.id,
          kinds: KINDS.Purchase,
        };
        break;
      default:
        return res.status(405).json({
          ok: false,
          message: "허용되지 않은 요청입니다.",
        });
    }

    const exProducts = await prisma.record.findMany({
      where,
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
      message: "특정 상품들에 대한 정보입니다.",
      products: exProducts,
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
