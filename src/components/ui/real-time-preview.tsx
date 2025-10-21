"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface RealTimePreviewProps {
  type: "image" | "audio" | "video";
  src: string;
  alt?: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  type,
  src,
  alt = "Preview",
  className,
  showControls = true,
  autoPlay = false,
  loop = false,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime);
      onTimeUpdate?.(media.currentTime, media.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    media.addEventListener("loadedmetadata", handleLoadedMetadata);
    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);
    media.addEventListener("ended", handleEnded);
    media.addEventListener("error", handleError);
    media.addEventListener("loadstart", handleLoadStart);

    return () => {
      media.removeEventListener("loadedmetadata", handleLoadedMetadata);
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
      media.removeEventListener("ended", handleEnded);
      media.removeEventListener("error", handleError);
      media.removeEventListener("loadstart", handleLoadStart);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded]);

  useEffect(() => {
    const media = mediaRef.current;
    if (media) {
      media.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    const media = mediaRef.current;
    if (media) {
      media.muted = isMuted;
    }
  }, [isMuted]);

  const handlePlayPause = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const media = mediaRef.current;
    if (media) {
      media.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleRestart = () => {
    const media = mediaRef.current;
    if (media) {
      media.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderMedia = () => {
    if (hasError) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-2">加载失败</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              重新加载
            </Button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (type) {
      case "image":
        return (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain rounded-lg"
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        );
      case "audio":
        return (
          <audio
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            className="w-full"
          />
        );
      case "video":
        return (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            className="w-full h-full object-contain rounded-lg"
            poster={src} // Use src as poster for better loading experience
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {renderMedia()}

      {showControls && (type === "audio" || type === "video") && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-white text-xs w-12">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-white text-xs w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRestart}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMuteToggle}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex items-center gap-2 w-20">
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>

                {type === "video" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePreview;
