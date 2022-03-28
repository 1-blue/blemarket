import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import mail from "@sendgrid/mail";

// prisma
import prisma from "@src/libs/client/prisma";

// helper function
import withHandler, { IResponseType } from "@src/libs/server/widthHandler";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.session.user)
    return res.status(401).json({
      ok: false,
      message: "이미 로그인한 상태입니다.\n로그아웃후에 다시 시도해주세요.",
    });

  const { email, phone } = req.body;
  const userData = {
    ...(email && { email }),
    ...(phone && { phone }),
  };
  const payload = Math.floor(10000 + Math.random() * 90000) + "";

  try {
    const token = await prisma.token.create({
      data: {
        payload,
        user: {
          connectOrCreate: {
            where: {
              ...userData,
            },
            create: {
              ...userData,
              name: "테스트 유저",
            },
          },
        },
      },
    });

    // if (phone) {
    //   const message = await twilioClient.messages.create({
    //     messagingServiceSid: process.env.TWILIO_MSID,
    //     to: process.env.PHONE!,
    //     body: `Your login token is ${payload}`,
    //   });

    //   console.log("message >> ", message);
    // }
    // if (email) {
    //   const message = await mail.send({
    //     to: "1-blue98@naver.com",
    //     from: "1-blue98@naver.com",
    //     subject: "subject >> Hello🕹️",
    //     text: `text >> code: ${payload}`,
    //     html: `html >> <h1>Hi, HTML</h1>`,
    //   });

    //   console.log("message >> ", message);
    // }

    res.status(201).json({
      ok: true,
      message: "토큰을 생성했습니다.",
    });
  } catch (error) {
    console.error("/api/users/enter error >> ", error);

    res.status(500).json({
      ok: false,
      message: "서버측 에러입니다.\n잠시후에 다시 시도해주세요",
      error,
    });
  }
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
