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
  const {
    method,
    body: { currentKinds, afterKinds },
  } = req;

  try {
    const exProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        records: {
          where: {
            kinds: currentKinds,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!exProduct)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 게시글입니다.",
      });

    if (exProduct.userId !== userId)
      return res.status(403).json({
        ok: false,
        message: "접근 권한이 없습니다.",
      });

    if (method === "PATCH") {
      await prisma.record.update({
        where: {
          id: exProduct.records[0].id,
        },
        data: {
          kinds: afterKinds,
        },
      });

      let state = null;
      state = afterKinds === "Sale" ? "판매상태" : state;
      state = afterKinds === "Reserved" ? "예약상태" : state;
      state = afterKinds === "Purchase" ? "구매상태" : state;

      return res.status(200).json({
        ok: true,
        message: `"${exProduct.name}"상품을 ${state}로 변경했습니다.`,
      });
    }
  } catch (error) {
    console.error("/api/products/[id]/kinds error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withApiSession(withHandler({ methods: ["PATCH"], handler }));
