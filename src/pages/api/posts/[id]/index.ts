import { NextApiRequest, NextApiResponse } from "next";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";
import prisma from "@src/libs/client/prisma";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const postId = +req.query.id;
  const userId = +req.session.user?.id!;
  const { method } = req;

  try {
    const exPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!exPost)
      return res.status(404).json({
        ok: false,
        message: "존재하지 않는 게시글입니다.",
      });
    if (+exPost.userId !== userId)
      return res.status(404).json({
        ok: false,
        message: "접근 권한이 없습니다.",
      });

    if (method === "DELETE") {
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "특정 게시글을 제거했습니다.",
      });
    } else if (method === "PATCH") {
      const {
        body: { question, latitude, longitude },
      } = req;

      const modifiedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          question,
          latitude,
          longitude,
        },
      });

      return res.status(200).json({
        ok: true,
        message: "특정 게시글을 수정했습니다.",
        post: modifiedPost,
      });
    } else if (method === "GET") {
      const foundPost = await prisma.post.findUnique({
        where: { id: postId },
      });

      return res.status(200).json({
        ok: true,
        message: "특정 게시글에 대한 정보를 가져왔습니다.",
        post: foundPost,
      });
    }

    res.status(405).json({
      ok: false,
      message: "잘못된 접근입니다.",
    });
  } catch (error) {
    console.error("/api/posts/[id] error >> ", error);

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
