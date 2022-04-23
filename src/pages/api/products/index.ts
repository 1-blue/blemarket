import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";
import { KINDS } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    body: { name, price, description, keywords, photo },
    session: { user },
  } = req;

  try {
    if (req.method === "GET") {
      const page = +req.query.page - 1;
      const offset = +req.query.offset;

      // 예약/판매완료 상품 제외할지 판단
      const reservedFilter = !!+req.query.reserved;
      const purchaseFilter = !!+req.query.purchase;
      const condition: { kinds: KINDS }[] = [{ kinds: KINDS.Sale }];
      if (!reservedFilter) condition.push({ kinds: KINDS.Reserved });
      if (!purchaseFilter) condition.push({ kinds: KINDS.Purchase });

      if (req.query.keyword) {
        const keyword = req.query.keyword + "";

        const productCount = await prisma.product.count({
          where: {
            keywords: {
              some: {
                keyword,
              },
            },
          },
        });
        if (productCount < page * offset) {
          return res.status(404).json({
            ok: false,
            message: "존재하지 않은 페이지입니다.",
          });
        }

        const findKeywordProducts = await prisma.product.findMany({
          take: offset,
          skip: page * offset,
          where: {
            keywords: {
              some: {
                keyword,
              },
            },
            records: {
              some: {
                OR: condition,
              },
            },
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
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        });

        return res.status(200).json({
          ok: true,
          message: `${keyword}인 상품들을 검색했습니다.`,
          products: findKeywordProducts,
          productCount,
        });
      }

      const productCount = await prisma.product.count();
      if (productCount < page * offset) {
        return res.status(404).json({
          ok: false,
          message: "존재하지 않은 페이지입니다.",
        });
      }

      const findProducts = await prisma.product.findMany({
        take: offset,
        skip: page * offset,
        where: {
          records: {
            some: {
              OR: condition,
            },
          },
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
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      res.status(200).json({
        ok: true,
        message: "모든 상품들을 가져왔습니다.",
        products: findProducts,
        productCount,
      });
    } else if (req.method === "POST") {
      // 상품 생성
      const createdProduct = await prisma.product.create({
        data: {
          name,
          price: +price,
          description,
          image: photo ? photo : null,
          user: {
            connect: {
              id: user?.id,
            },
          },
          records: {
            create: {
              kinds: "Sale",
              user: {
                connect: {
                  id: user?.id,
                },
              },
            },
          },
        },
      });

      // 키워드 생성 or 찾고 상품과 연결
      const keywordsPromise = (keywords as string).split(" ").map((keyword) =>
        prisma.keyword.upsert({
          create: {
            keyword,
            products: {
              connect: {
                id: createdProduct.id,
              },
            },
          },
          update: {
            products: {
              connect: {
                id: createdProduct.id,
              },
            },
          },
          where: {
            keyword,
          },
        })
      );

      await Promise.allSettled(keywordsPromise);

      // >>> 이거 실행이 안 되는 이유는...?
      await res.unstable_revalidate("/");

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
