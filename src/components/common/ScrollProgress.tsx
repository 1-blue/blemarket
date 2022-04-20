import React, { useState, useEffect, useCallback } from "react";

const ScrollProgress = () => {
  const [currentPositionY, setCurrentPositionY] = useState(0);

  // 현재 스크롤 Y값 %로 구하기
  const scrollEvent = useCallback(() => {
    setCurrentPositionY(
      window.scrollY /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight)
    );
  }, []);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, [scrollEvent]);

  return (
    <aside
      className="absolute top-0 left-0 z-20 h-1 shadow-lg m-0 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-600"
      style={{
        width: `${currentPositionY * 100}%`,
      }}
    />
  );
};

export default ScrollProgress;
