import React, { useState } from "react";

interface RetryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string; // 失败时显示的占位图片
  maxRetry?: number; // 最大重试次数
}

const RetryImage: React.FC<RetryImageProps> = ({ src, fallback = "/imgs/placeholder.png", maxRetry = 1, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount < maxRetry) {
      // 触发重试（加时间戳防止缓存）
      setRetryCount(retryCount + 1);
      setCurrentSrc(`${src}?retry=${retryCount + 1}&ts=${Date.now()}`);
    } else {
      setCurrentSrc(fallback);
    }
  };

  return <img {...props} src={currentSrc as string} onError={handleError} />;
};

export default RetryImage;
