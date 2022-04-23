import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

// aws-s3
import { copyPhoto, deletePhoto } from "@src/libs/server/s3";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const productId = +req.query.id;
  const userId = +req.session.user?.id!;
  const { method } = req;

  try {
    const exProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!exProduct)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않은 게시글에 요청을 했습니다.",
      });

    if (exProduct.userId !== userId)
      return res.status(403).json({
        ok: false,
        message: "해당 게시글에 대한 권한이 없습니다.",
      });

    // 상품 제거
    if (method === "DELETE") {
      if (exProduct?.image) {
        copyPhoto(exProduct.image);
        deletePhoto(exProduct.image);
      }

      await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "상품을 제거했습니다.",
      });
    }
    // 상품 수정
    else if (method === "PATCH") {
      const {
        body: { name, price, description, keywords, photo },
      } = req;

      if (exProduct?.image && photo) {
        copyPhoto(exProduct.image);
        deletePhoto(exProduct.image);
      }

      const modifiedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          price: +price,
          description,
          image: photo ? photo : null,
        },
        include: {
          keywords: {
            select: {
              keyword: true,
            },
          },
        },
      });

      // >>> 기존 키워드는 그대로 연결하고 제거된 키워드만 연결 끊는 방식으로 수정하기!
      const exKeywords = modifiedProduct.keywords.map(({ keyword }) => keyword);
      // 기존 키워드 연결 끊기
      const disconnectKeywordsPromise = exKeywords.map((keyword) =>
        prisma.keyword.update({
          where: {
            keyword,
          },
          data: {
            products: {
              disconnect: {
                id: productId,
              },
            },
          },
        })
      );
      // 키워드 생성 or 찾고 상품과 연결
      const keywordsPromise = (keywords as string).split(" ").map((keyword) =>
        prisma.keyword.upsert({
          create: {
            keyword,
            products: {
              connect: {
                id: productId,
              },
            },
          },
          update: {
            products: {
              connect: {
                id: productId,
              },
            },
          },
          where: {
            keyword,
          },
        })
      );

      await Promise.all(disconnectKeywordsPromise);
      await Promise.all(keywordsPromise);

      // >>> 이거 실행이 안 되는 이유는...?
      await res.unstable_revalidate("/");

      res.status(201).json({
        ok: true,
        message: `"${name}"을 수정했습니다.`,
        product: modifiedProduct,
      });
    }
    // 상품 정보 요청
    else if (method === "GET") {
      const foundProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          keywords: {
            select: {
              keyword: true,
            },
          },
        },
      });

      return res.status(200).json({
        ok: true,
        message: "특정 상품의 정보를 가져왔습니다.",
        product: foundProduct,
      });
    }
  } catch (error) {
    console.error("/api/products/[id] error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["DELETE", "PATCH", "GET"], handler })
);
