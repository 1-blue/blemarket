import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

// aws s3
import S3 from "@src/libs/server/s3";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const { method } = req;
  const userId = +req.session.user?.id!;

  try {
    const exUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // 2022/04/13 - 내 정보 요청 - by 1-blue
    if (method === "GET") {
      return res.status(200).json({
        ok: true,
        message: "로그인된 유저의 정보입니다.",
        user: exUser,
      });
    }
    // 2022/04/13 - 내 정보 변경 - by 1-blue
    else if (method === "POST") {
      const photo = req.body.photo as string;
      const name = req.body.name as string;
      const email = req.body.email as string;
      const phone = req.body.phone as string;

      // 이름 변경
      if (name && exUser?.name !== name) {
        const isOverlapName = await prisma.user.findFirst({
          where: {
            AND: {
              NOT: {
                id: userId,
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
            id: userId,
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
                id: userId,
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
            id: userId,
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
                id: userId,
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
            id: userId,
          },
          data: {
            phone,
          },
        });
      }

      if (photo) {
        // 이미 multer-s3를 이용해서 이미지를 넣어놓은 상태임
        // 기존 이미지 지우기
        if (exUser?.avatar) {
          S3.deleteObject(
            {
              Bucket: "blemarket",
              Key: exUser.avatar,
            },
            (error) => console.error(error)
          );
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            avatar: photo,
          },
        });
      }

      await res.unstable_revalidate(`/profile/user/${userId}`);

      return res.status(200).json({
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
