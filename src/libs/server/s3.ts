import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.BLEMARKET_AWS_REGION,
  accessKeyId: process.env.BLEMARKET_AWS_ACCESS_KEY,
  secretAccessKey: process.env.BLEMARKET_AWS_SECRET_KEY,
});

const S3 = new AWS.S3();

export default S3;

// 이미지 생성 경로 얻는 헬퍼 함수
export const getPhotoPath = (filename: string) =>
  `images/${process.env.NODE_ENV}/${filename}_${Date.now()}`;

// S3 이미지 제거
export const deletePhoto = (photo: string) =>
  S3.deleteObject(
    {
      Bucket: "blemarket",
      Key: photo,
    },
    (error, data) => {
      if (error) {
        console.error("error >> ", photo, " >> ", error);
      }
    }
  );

// S3 이미지 이동
export const copyPhoto = (originalSource: string) =>
  S3.copyObject(
    {
      Bucket: "blemarket",
      CopySource: "blemarket/" + originalSource,
      Key:
        originalSource.slice(0, originalSource.lastIndexOf("/")) +
        "/remove" +
        originalSource.slice(originalSource.lastIndexOf("/")),
    },
    (error, data) => {
      if (error) {
        console.error("error >> ", originalSource, " >> ", error);
      }
    }
  );
