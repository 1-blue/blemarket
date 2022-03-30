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
    body: { name, price, description, keywords },
    session: { user },
  } = req;

  try {
    if (req.method === "GET") {
      const findProducts = await prisma.product.findMany({
        include: {
          records: {
            where: {
              kinds: "Favorite",
            },
            select: {
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
      });

      res.status(200).json({
        ok: true,
        message: "모든 상품들을 가져왔습니다.",
        products: findProducts,
      });
    } else if (req.method === "POST") {
      const createdProduct = await prisma.product.create({
        data: {
          name,
          price: +price,
          description,
          image: "추후에 추가",
          keywords,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

      res.status(201).json({
        ok: true,
        message: `"${name}"을 등록했습니다.`,
        product: createdProduct,
      });
    }
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
  withHandler({ methods: ["GET", "POST"], handler })
);
