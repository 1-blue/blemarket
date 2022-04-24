import { NextApiRequest, NextApiResponse } from "next";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";
import { withApiSession } from "@src/libs/server/withSession";

// aws s3
import { copyPhoto, deletePhoto } from "@src/libs/server/s3";

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

      let namePromise = null;
      let emailPromise = null;
      let phonePromise = null;
      let photoPromise = null;

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

        namePromise = prisma.user.update({
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

        emailPromise = prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email,
          },
        });
      }
      // 휴대폰 번호 변경
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

        phonePromise = prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            phone,
          },
        });
      }
      // 프로필 사진 변경
      if (photo) {
        // 이미 multer-s3를 이용해서 이미지를 넣어놓은 상태임
        // 기존 이미지 지우기
        if (exUser?.avatar) {
          copyPhoto(exUser.avatar);
          deletePhoto(exUser.avatar);
        }

        photoPromise = prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            avatar: photo,
          },
        });
      }

      await Promise.allSettled([
        namePromise,
        emailPromise,
        phonePromise,
        photoPromise,
      ]);

      await res.unstable_revalidate(`/profile/user/${userId}`);

      return res.status(200).json({
        ok: true,
        message: "정보를 변경했습니다.",
      });
    }
    // 2022/04/18 - 로그아웃 - by 1-blue
    else if (method === "PATCH") {
      req.session.destroy();

      return res.status(200).json({
        ok: true,
        message: "로그아웃에 성공했습니다.",
      });
    }
    // 2022/04/18 - 계정삭제 - by 1-blue
    else if (method === "DELETE") {
      // 프로필 사진 제거
      if (exUser?.avatar) {
        copyPhoto(exUser.avatar);
        deletePhoto(exUser.avatar);
      }
      // 해당 유저의 상품 게시글 이미지도 모두 제거
      const productsOfMe = await prisma.product.findMany({ where: { userId } });
      const productPhotos = productsOfMe
        ?.filter((product) => product.image)
        ?.map((product) => product.image);
      if (productPhotos.length > 0) {
        productPhotos.forEach((photo) => {
          if (!photo) return;
          copyPhoto(photo);
          deletePhoto(photo);
        });
      }

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      req.session.destroy();

      return res.status(200).json({
        ok: true,
        message: `${exUser?.name}님의 계정을 삭제했습니다.`,
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
  withHandler({ methods: ["GET", "POST", "PATCH", "DELETE"], handler })
);
