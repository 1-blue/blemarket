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
      <meta
        name="keyword"
        content="blemarket, 당근마켓, 클론, clone, 노마드코더, nomadcoders"
      />
      <meta name="description" content={description} />
      <meta name="author" content="1-blue" />

      {/* 카카오톡 미리보기에 제공될 정보 */}
      <meta property="og:url" content={`http://localhost:3000${asPath}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={
          photo ? combinePhotoUrl(photo) : "http://localhost:3000/favicon.ico"
        }
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="blemarket" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="600" />
    </Head>
  );
};

HeadInfo.defaultProps = {
  title: "blemarket",
  description: "Next.js를 이용한 당근마켓 클론 - 공부용",
};

export default HeadInfo;
