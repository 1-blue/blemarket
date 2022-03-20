import type { NextPage } from "next";
import Link from "next/link";

// type
import { ICON_SHAPE } from "@src/types";

// common-component
import Icon from "@src/components/common/Icon";

const Profile: NextPage = () => {
  return (
    <div className="px-4 divide-y-2 space-y-4">
      <Link href="/profile/edit">
        <a className="flex items-center space-x-2">
          <div className="w-16 h-16 bg-slate-500 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">Steve Jebs</span>
            <span className="text-sm text-gray-700">Edit profile &rarr;</span>
          </div>
        </a>
      </Link>
      <div className="flex justify-around items-center pt-4">
        <Link href="/profile/bought">
          <a className="flex-1 group flex flex-col items-center">
            <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500 ">
              <Icon shape={ICON_SHAPE.CART} />
            </div>
            <span className="text-gray-700 font-medium">판매내역</span>
          </a>
        </Link>
        <Link href="/profile/bought">
          <a className="flex-1 group flex flex-col items-center">
            <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500">
              <Icon shape={ICON_SHAPE.BAG} />
            </div>
            <span>구매내역</span>
          </a>
        </Link>
        <Link href="/profile/loved">
          <a className="flex-1 group flex flex-col items-center">
            <div className="flex justify-center items-center bg-orange-400 w-16 h-16 rounded-full text-white mb-2 group-hover:bg-orange-500">
              <Icon shape={ICON_SHAPE.HEART} />
            </div>
            <span>관심목록</span>
          </a>
        </Link>
      </div>
      <div>
        <div className="flex space-x-2 pt-4 mb-4">
          <div className="w-12 h-12 bg-slate-400 rounded-full" />
          <div>
            <h4>니꼬</h4>
            <div className="flex">
              <svg
                className="text-yellow-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg
                className="text-yellow-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg
                className="text-yellow-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg
                className="text-yellow-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg
                className="text-gray-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm px-4">
            Normally, both your asses would be dead as fucking fried chicken,
            but you happen to pull this shit while I&apos;m in a transitional
            period so I don&apos;t wanna kill you, I wanna help you. But I
            can&apos;t give you this case, it don&apos;t belong to me. Besides,
            I&apos;ve already been through too much shit this morning over this
            case to hand it over to your dumb ass.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
