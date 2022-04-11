import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { combinePhotoUrl } from "@src/libs/client/util";

interface IProps {
  title?: string;
  description?: string;
  photo: string | null;
}

// >> 배포 시 localhost:3000 대신 제대로 된 경로로 수정하기

const HeadInfo = ({ title, description, photo }: IProps) => {
  const { asPath } = useRouter();

  return (
    <Head>
      {/* 현 페이지 제목 */}
      <title>{title}</title>

      {/* 페비콘 */}
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* SEO */}
      <meta name="description" content={description} />

      {/* 카카오톡, 네이버 블로그 미리보기에 제공될 정보 */}
      <meta property="og:url" content={`http://localhost:3000${asPath}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={
          photo ? combinePhotoUrl(photo) : "http://localhost:3000/favicon.ico"
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
          photo ? combinePhotoUrl(photo) : "http://localhost:3000/favicon.ico"
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
