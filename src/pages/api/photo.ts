import nextConnect from "next-connect";
import S3 from "@src/libs/server/s3";
import multer from "multer";
import multerS3 from "multer-s3";

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: "blemarket",
    key(req, file, cb) {
      const filename = file.originalname.split(".")[0];
      cb(null, `images/${filename}_${Date.now()}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 }, // 1mb
});

const app = nextConnect();

// 2022/04/04 - AWS S3에 이미지 업로드 및 이미지명으로 응답 - 1-blue
app.post(upload.single("photo"), (req, res) => {
  res.json({
    ok: true,
    message: "AWS S3에 이미지를 업로드 성공했습니다.",
    photo: req.file.key,
  });
});

export default app;

export const config = {
  api: {
    bodyParser: false,
  },
};
