import { useCallback, useState } from "react";
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { toast } from "react-toastify";

// type
import { ICON_SHAPE, ApiResponse, SimpleUser } from "@src/types";
import { Post } from "@prisma/client";

// common-component
import Icon from "@src/components/common/Icon";
import Profile from "@src/components/common/Profile";
import HeadInfo from "@src/components/common/HeadInfo";
import SideButton from "@src/components/common/SideButton";
import Modal from "@src/components/common/Modal";
import Spinner from "@src/components/common/Spinner";

// component
import AnswerSection from "@src/components/Answer/AnswerSection";

// util
import { combineClassNames } from "@src/libs/client/util";
import { dateFormat } from "@src/libs/client/dateFormat";
import prisma from "@src/libs/client/prisma";

// hook
import useMutation from "@src/libs/hooks/useMutation";
import useMe from "@src/libs/hooks/useMe";
import useResponseToast from "@src/libs/hooks/useResponseToast";

interface IPostWithUser extends Post {
  user: SimpleUser;
  _count: {
    answers: number;
  };
}
interface IPostResponse extends ApiResponse {
  post: IPostWithUser;
}

interface IRecommendationResponse extends ApiResponse {
  isRecommendation: boolean;
  recommendationCount: number;
}

const CommunityPostDetail: NextPage<IPostResponse> = ({ post }) => {
  const router = useRouter();
  const { me } = useMe();

  // 2022/04/13 - 게시글의 궁금해요 정보 요청 - by 1-blue
  const { data: recommendationData, mutate: recommendationMutate } =
    useSWR<IRecommendationResponse>(
      router.query.id ? `/api/posts/${router.query.id}/recommendation` : null
    );
  // 2022/04/13 - 궁금해요 추가 메서드 - by 1-blue
  const [addRecommendation, { loading: addRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`);
  // 2022/04/13 - 궁금해요 제거 메서드 - by 1-blue
  const [removeRecommendation, { loading: removeRecommendationLoading }] =
    useMutation(`/api/posts/${router.query.id}/recommendation`, "DELETE");
  // 2022/03/27 - 궁금해요 클릭 - by 1-blue
  const onClickRecommendation = useCallback(() => {
    if (addRecommendationLoading)
      return toast.error("이미 궁금해요 추가 처리중입니다.");
    if (removeRecommendationLoading)
      return toast.error("이미 궁금해요 제거 처리중입니다.");

    recommendationMutate(
      (prev) =>
        prev && {
          ...prev,
          recommendationCount: prev.isRecommendation
            ? prev.recommendationCount - 1
            : prev.recommendationCount + 1,
          isRecommendation: !prev.isRecommendation,
        },
      false
    );

    if (recommendationData?.isRecommendation) removeRecommendation(null);
    else addRecommendation(null);
  }, [
    addRecommendationLoading,
    removeRecommendationLoading,
    recommendationMutate,
    recommendationData,
    addRecommendation,
    removeRecommendation,
  ]);

  //  2022/04/13 - 댓글 토글 값 - by 1-blue
  const [toggleAnswer, setToggleAnswer] = useState(true);

  // 2022/04/18 - 질문 제거 및 수정 모달 토글 값 - by 1-blue
  const [toggleModal, setToggleModal] = useState(false);
  // 2022/04/17 - 질문 제거 - by 1-blue
  const [removePost, { data: removePostResponse, loading: removePostLoading }] =
    useMutation<ApiResponse>(`/api/posts/${router.query.id}`, "DELETE");
  // 2022/04/17 - 질문 제거 - 1-blue
  const onRemovePost = useCallback(() => {
    if (removePostLoading) return toast.warning("이미 질문을 제거중입니다!");
    removePost({});
  }, [removePost, removePostLoading]);
  // 2022/04/17 - 질문 제거 성공 시 메시지 및 페이지 이동 - by 1-blue
  useResponseToast({
    response: removePostResponse,
    move: "/community",
  });

  if (router.isFallback) return <Spinner kinds="page" />;

  return (
    <>
      <HeadInfo
        title={`blemarket | Community`}
        description={post.question}
        photo={null}
      />

      {/* 게시글 작성자, 내용, 궁금해요와 답변아이콘 버튼 */}
      <article>
        <section>
          <div className="flex justify-between items-baseline">
            <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              동네질문
            </span>
            <span className="font-semibold text-xs">
              ( {dateFormat(post.updatedAt!, "YYYY/MM/DD hh:mm:ss")} )
            </span>
          </div>
          {post.user && <Profile user={post.user} />}
        </section>
        <section className="flex mt-2 px-4 text-gray-700">
          <span className="text-orange-500 font-medium mr-2">Q.</span>
          <span className="whitespace-pre-wrap">{post.question}</span>
        </section>
        <section className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
          <button
            className={combineClassNames(
              "flex space-x-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 focus:rounded-sm",
              recommendationData?.isRecommendation
                ? "text-orange-500 font-semibold"
                : ""
            )}
            type="button"
            onClick={onClickRecommendation}
          >
            <Icon shape={ICON_SHAPE.CHECK} width={16} height={16} />
            <span>궁금해요 {recommendationData?.recommendationCount}</span>
          </button>
          <button
            type="button"
            className={combineClassNames(
              "flex space-x-2 items-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4 focus:rounded-sm",
              toggleAnswer ? "text-orange-500 font-semibold" : ""
            )}
            onClick={() => setToggleAnswer((prev) => !prev)}
          >
            <Icon shape={ICON_SHAPE.CHAT} width={16} height={16} />
            <span>답변 {post._count.answers}</span>
          </button>
        </section>
      </article>

      {/* 댓글 영역 */}
      <AnswerSection
        target="posts"
        toggle={toggleAnswer}
        count={post._count.answers}
        setToggle={setToggleAnswer}
      />

      {/* 질문 삭제 및 수정 모달 토글 버튼 */}
      {post.userId === me?.id && (
        <SideButton
          contents={<Icon shape={ICON_SHAPE.DOTS_H} />}
          onClick={() => setToggleModal((prev) => !prev)}
        />
      )}

      {/* 질문 수정 및 삭제 모달창 */}
      {toggleModal && (
        <Modal position="middle" setToggleModal={setToggleModal}>
          <>
            <Link
              href={{
                pathname: "/community/modify",
                query: { postId: router.query.id },
              }}
            >
              <a className="block text-xl p-4 w-full hover:text-orange-500 hover:bg-orange-100 transition-colors text-center">
                질문 수정
              </a>
            </Link>
            <button
              type="button"
              className="text-xl p-4 w-full hover:text-orange-500 hover:bg-orange-100 transition-colors"
              onClick={onRemovePost}
            >
              질문 삭제
            </button>
          </>
        </Modal>
      )}

      {/* 질문 삭제 중 메시지 */}
      {removePostLoading && (
        <aside className="fixed bg-black/60 top-0 left-0 w-full h-full z-20 flex justify-center items-center">
          <section className="bg-white px-8 py-12 rounded-md">
            <span className="text-xl text-orange-500 whitespace-pre-line">
              {"질문을 삭제중입니다...\n잠시만 기다려주세요!"}
            </span>
          </section>
        </aside>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const postId = Number(context.params?.id);

  const postWithUser = await prisma.post.findUnique({
    where: {
      id: postId || 1,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
  });

  return {
    props: {
      ok: true,
      message: "특정 게시글을 가져왔습니다.",
      post: JSON.parse(JSON.stringify(postWithUser)),
    },
  };
};

export default CommunityPostDetail;
