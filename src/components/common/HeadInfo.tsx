import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { combinePhotoUrl } from "@src/libs/client/util";

type Props = {
  title?: string;
  description?: string;
  photo: string | null;
};

const HeadInfo = ({ title, description, photo }: Props) => {
  const { asPath } = useRouter();

  return (
    <Head>
      {/* 현 페이지 제목 */}
      <title>{title}</title>

      {/* SEO */}
      <meta name="description" content={description} />

      {/* 카카오톡, 네이버 블로그 미리보기에 제공될 정보 */}
      <meta
        property="og:url"
        content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}${asPath}`}
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={
          photo
            ? combinePhotoUrl(photo)
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/logo.jpg`
        }
      />

      {/* 트위터 */}
      <meta
        name="twitter:card"
        content={`제목: ${title}
        내용: ${description}`}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          photo
            ? combinePhotoUrl(photo)
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/logo.jpg`
        }
      />
    </Head>
  );
};

HeadInfo.defaultProps = {
  title: "blemarket",
  description: "Next.js를 이용한 당근마켓 클론 - 공부용",
};

export default HeadInfo;
