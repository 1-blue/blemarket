import { Dispatch, SetStateAction, useEffect, useState } from "react";

// 2022/04/05 - 이미지 업로드를 확정짓기 전에 보여줄 blob이미지경로를 만들어주는 훅 - by 1-blue
const usePreview = (
  photo?: FileList
): [string, Dispatch<SetStateAction<string>>] => {
  const [photoLink, setPhotoLink] = useState("");

  useEffect(() => {
    if (photo && photo.length > 0) setPhotoLink(URL.createObjectURL(photo[0]));
  }, [photo, setPhotoLink]);

  return [photoLink, setPhotoLink];
};

export default usePreview;
