import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// stream 더미 데이터 50개 생성
const main = async () => {
  const streamsPromise = Array(50)
    .fill(null)
    .map((v, i) => i + 1)
    .map((v) =>
      prisma.post.create({
        data: {
          question: "[테스트] 질문" + v,
          user: {
            connect: {
              id: 1,
            },
          },
        },
      })
    );

  const result = await Promise.all(streamsPromise);

  console.log("result >> ", result);
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
