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

  try {
    const exProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        keywords: {
          select: {
            keyword: true,
          },
        },
      },
    });

    if (!exProduct)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 게시글입니다.",
      });

    // 현 상품 작성자의 작성자의 다른 상품 찾기
    const relatedUserProductsPromise = prisma.product.findMany({
      where: {
        userId: exProduct.user.id,
        NOT: {
          id: productId,
        },
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
      take: 8,
      orderBy: {
        updatedAt: "desc",
      },
    });

    // 현 상품과 같은 키워드를 가진 상품들 찾기
    const relatedKeywordProductsPromise = exProduct.keywords.map((keyword) =>
      prisma.product.findMany({
        where: {
          NOT: {
            id: productId,
          },
          keywords: {
            some: {
              keyword: keyword.keyword,
            },
          },
        },
      })
    );

    const [relatedUserProducts] = await Promise.all([
      relatedUserProductsPromise,
    ]);
    const relatedKeywordProducts = (
      await Promise.all(relatedKeywordProductsPromise!)
    ).flat(1);

    // >>> 애초에 DB에서 검색할 때 제거하는게 효율적이라고 생각하는데 다른 방법이 있는지 못찾아서 찾고 나서 중복된 상품들 제거하는 방식으로 해결했지만 찝찝함
    // >>> 상품이 늘어나고 키워드가 많아질수록 연산 시간이 늘어날 것 같음
    // 중복 제거
    const distinctRelatedKeywordProducts = relatedKeywordProducts.filter(
      (outerProduct, index, products) =>
        products.findIndex(
          (innerProduct) => outerProduct?.id === innerProduct?.id
        ) === index
    );

    return res.status(200).json({
      ok: true,
      message: "연관된 게시글들을 가져왔습니다.",
      relatedUserProducts,
      relatedKeywordProducts: distinctRelatedKeywordProducts.slice(0, 8),
    });
  } catch (error) {
    console.error("/api/products/[id]/relation error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
