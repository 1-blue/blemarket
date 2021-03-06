import nextConnect from "next-connect";

// aws-s3
import { upload } from "@src/libs/server/s3";

const app = nextConnect();

// 2022/04/04 - AWS S3에 이미지 업로드 및 이미지명으로 응답 - 1-blue
app.post(upload.single("photo"), (req, res) => {
  res.json({
    ok: true,
    message: "AWS S3에 이미지를 업로드 성공했습니다.",
    //@ts-ignore
    photo: req.file.key,
  });
});

export default app;

// 기본적으로 bodyParser를 적용해서 데이터를 파싱하므로, 이미지같은 파싱이 필요없는 데이터를 받을 때 사용하는 것으로 알고 있음
export const config = {
  api: {
    bodyParser: false,
  },
};
