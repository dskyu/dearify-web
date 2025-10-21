"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Film,
  Sparkles,
  Clapperboard,
  Camera,
  Wand2,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Play,
  Download,
  Share2,
  Settings,
  Sliders,
  Video,
  FileVideo,
  Image,
  Type,
  Scissors,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import DragDropUpload from "@/components/ui/drag-drop-upload";
import RealTimePreview from "@/components/ui/real-time-preview";

interface VideoStyle {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isFree?: boolean;
  isPopular?: boolean;
  credits: number;
  estimatedTime: string;
  duration?: string;
}

interface VideoSettings {
  style: string;
  duration: number;
  resolution: string;
  aspectRatio: string;
  fps: number;
  quality: string;
  transitions: boolean;
  effects: string[];
}

interface TimelineItem {
  id: string;
  type: "image" | "video" | "text";
  src: string;
  duration: number;
  startTime: number;
  title: string;
}

const VideoGenerationPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("text-to-video");
  const [textPrompt, setTextPrompt] = useState("");
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [settings, setSettings] = useState<VideoSettings>({
    style: "text-to-video",
    duration: 30,
    resolution: "1920x1080",
    aspectRatio: "16:9",
    fps: 30,
    quality: "high",
    transitions: true,
    effects: ["fade"],
  });

  const videoStyles: VideoStyle[] = [
    {
      id: "text-to-video",
      name: "Text to Video",
      description: "Generate videos from text descriptions using AI",
      thumbnail: "https://picsum.photos/300/300?random=25",
      category: "Generation",
      isPopular: true,
      credits: 15,
      estimatedTime: "5m",
      duration: "5s-30s",
    },
    {
      id: "image-animation",
      name: "Image Animation",
      description: "Bring static images to life with smooth animations",
      thumbnail: "https://picsum.photos/300/300?random=26",
      category: "Animation",
      credits: 12,
      estimatedTime: "3m",
      duration: "3s-15s",
    },
    {
      id: "style-transfer",
      name: "Style Transfer",
      description: "Apply artistic styles to your videos",
      thumbnail: "https://picsum.photos/300/300?random=27",
      category: "Effects",
      isFree: true,
      credits: 8,
      estimatedTime: "2m",
      duration: "5s-60s",
    },
    {
      id: "cinematic-trailer",
      name: "Cinematic Trailer",
      description: "Create epic movie-style trailers from your content",
      thumbnail: "https://picsum.photos/300/300?random=29",
      category: "Generation",
      isPopular: true,
      credits: 20,
      estimatedTime: "8m",
      duration: "30s-2m",
    },
    {
      id: "motion-graphics",
      name: "Motion Graphics",
      description: "Generate animated graphics and visual elements",
      thumbnail: "https://picsum.photos/300/300?random=30",
      category: "Animation",
      isFree: true,
      credits: 6,
      estimatedTime: "2m",
      duration: "3s-30s",
    },
    {
      id: "video-enhancement",
      name: "Video Enhancement",
      description: "Upscale and enhance video quality with AI",
      thumbnail: "https://picsum.photos/300/300?random=28",
      category: "Enhancement",
      credits: 10,
      estimatedTime: "4m",
      duration: "Any length",
    },
  ];

  const categories = [
    { name: "All", count: videoStyles.length },
    {
      name: "Generation",
      count: videoStyles.filter((e) => e.category === "Generation").length,
    },
    {
      name: "Animation",
      count: videoStyles.filter((e) => e.category === "Animation").length,
    },
    {
      name: "Effects",
      count: videoStyles.filter((e) => e.category === "Effects").length,
    },
    {
      name: "Enhancement",
      count: videoStyles.filter((e) => e.category === "Enhancement").length,
    },
  ];

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const addTimelineItem = (type: "image" | "video" | "text") => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      type,
      src:
        type === "text"
          ? ""
          : "https://picsum.photos/300/300?random=" +
            Math.floor(Math.random() * 100),
      duration: 5,
      startTime: timelineItems.reduce((acc, item) => acc + item.duration, 0),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${timelineItems.length + 1}`,
    };
    setTimelineItems([...timelineItems, newItem]);
  };

  const removeTimelineItem = (id: string) => {
    setTimelineItems(timelineItems.filter((item) => item.id !== id));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setGeneratedVideo(
        "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      );
      setIsGenerating(false);
    }, 5000);
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement("a");
      link.href = generatedVideo;
      link.download = `generated-video-${Date.now()}.mp4`;
      link.click();
    }
  };

  const handleShare = () => {
    if (generatedVideo && navigator.share) {
      navigator.share({
        title: "AI Generated Video",
        text: "Check out this amazing AI-generated video!",
        url: generatedVideo,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            AI Video Generation
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create stunning videos with AI. Generate content from text, animate
          images, apply effects, and enhance your videos with cutting-edge
          technology.
        </p>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Input Method
              </CardTitle>
              <CardDescription>
                Choose how you want to create your video content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text to Video</TabsTrigger>
                  <TabsTrigger value="upload">Upload Media</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline Editor</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-prompt">Describe your video</Label>
                    <Textarea
                      id="text-prompt"
                      placeholder="Describe the video you want to generate... e.g., 'A sunset over mountains with birds flying across the sky'"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <DragDropUpload
                    accept="video/*,image/*"
                    maxSize={100}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    selectedFile={selectedFile}
                    placeholder="拖拽视频或图片文件到此处或点击上传"
                    description="支持 MP4, MOV, JPG, PNG 格式，最大 100MB"
                  />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Timeline Editor</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimelineItem("image")}
                        >
                          <Image className="h-4 w-4 mr-1" />
                          Add Image
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimelineItem("video")}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Add Video
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addTimelineItem("text")}
                        >
                          <Type className="h-4 w-4 mr-1" />
                          Add Text
                        </Button>
                      </div>
                    </div>

                    {timelineItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>
                          No items in timeline. Add some media to get started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {timelineItems.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {item.type === "image" && (
                                <Image className="h-4 w-4" />
                              )}
                              {item.type === "video" && (
                                <Video className="h-4 w-4" />
                              )}
                              {item.type === "text" && (
                                <Type className="h-4 w-4" />
                              )}
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Duration:</Label>
                                <Input
                                  type="number"
                                  value={item.duration}
                                  onChange={(e) => {
                                    const newItems = [...timelineItems];
                                    newItems[index].duration =
                                      parseInt(e.target.value) || 0;
                                    setTimelineItems(newItems);
                                  }}
                                  className="w-16 h-6 text-xs"
                                  min="1"
                                  max="60"
                                />
                                <span className="text-xs text-gray-500">
                                  seconds
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTimelineItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Media Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimePreview
                  type={
                    selectedFile?.type.startsWith("video/") ? "video" : "image"
                  }
                  src={previewUrl}
                  alt="Media preview"
                  className="w-full h-96"
                  showControls={true}
                />
              </CardContent>
            </Card>
          )}

          {/* Generated Result */}
          {generatedVideo && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generated Video
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RealTimePreview
                  type="video"
                  src={generatedVideo}
                  alt="Generated video"
                  className="w-full h-96"
                  showControls={true}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Settings & Styles */}
        <div className="space-y-6">
          {/* Style Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Choose Style
              </CardTitle>
              <CardDescription>
                Select an AI style for your video generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedStyle} onValueChange={setSelectedStyle}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="all">All Styles</TabsTrigger>
                </TabsList>
                <TabsContent value="popular" className="space-y-3">
                  {videoStyles
                    .filter((style) => style.isPopular)
                    .map((style) => (
                      <div
                        key={style.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          selectedStyle === style.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <img
                          src={style.thumbnail}
                          alt={style.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">
                              {style.name}
                            </h4>
                            <Badge className="bg-orange-500 text-white text-xs">
                              POPULAR
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {style.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {style.credits} credits
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {style.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="all" className="space-y-3">
                  {videoStyles.map((style) => (
                    <div
                      key={style.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedStyle === style.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() => setSelectedStyle(style.id)}
                    >
                      <img
                        src={style.thumbnail}
                        alt={style.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{style.name}</h4>
                          {style.isFree && (
                            <Badge className="bg-green-500 text-white text-xs">
                              FREE
                            </Badge>
                          )}
                          {style.isPopular && (
                            <Badge className="bg-orange-500 text-white text-xs">
                              POPULAR
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {style.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {style.credits} credits
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {style.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Video Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Duration (seconds)
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[settings.duration]}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        duration: value[0],
                      }))
                    }
                    max={300}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5s</span>
                    <span>{settings.duration}s</span>
                    <span>5m</span>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Resolution</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["1920x1080", "1280x720", "3840x2160", "854x480"].map(
                    (res) => (
                      <Button
                        key={res}
                        variant={
                          settings.resolution === res ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSettings((prev) => ({ ...prev, resolution: res }))
                        }
                      >
                        {res}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Aspect Ratio</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["16:9", "9:16", "1:1", "4:3", "21:9", "3:2"].map(
                    (ratio) => (
                      <Button
                        key={ratio}
                        variant={
                          settings.aspectRatio === ratio ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            aspectRatio: ratio,
                          }))
                        }
                      >
                        {ratio}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* FPS */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Frame Rate (FPS)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[24, 30, 60].map((fps) => (
                    <Button
                      key={fps}
                      variant={settings.fps === fps ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings((prev) => ({ ...prev, fps }))}
                    >
                      {fps} FPS
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quality</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((quality) => (
                    <Button
                      key={quality}
                      variant={
                        settings.quality === quality ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, quality }))
                      }
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Effects</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["fade", "zoom", "pan", "rotate", "blur", "glow"].map(
                    (effect) => (
                      <Button
                        key={effect}
                        variant={
                          settings.effects.includes(effect)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          const newEffects = settings.effects.includes(effect)
                            ? settings.effects.filter((e) => e !== effect)
                            : [...settings.effects, effect];
                          setSettings((prev) => ({
                            ...prev,
                            effects: newEffects,
                          }));
                        }}
                      >
                        {effect}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="transitions" className="text-sm font-medium">
                    Smooth Transitions
                  </Label>
                  <Switch
                    id="transitions"
                    checked={settings.transitions}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, transitions: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={handleGenerate}
                disabled={
                  (!textPrompt &&
                    !selectedFile &&
                    timelineItems.length === 0) ||
                  isGenerating
                }
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Film className="h-5 w-5 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
              {(textPrompt || selectedFile || timelineItems.length > 0) && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    Cost:{" "}
                    {videoStyles.find((s) => s.id === selectedStyle)?.credits ||
                      0}{" "}
                    credits
                  </p>
                  <p className="text-xs text-gray-500">
                    Estimated time:{" "}
                    {videoStyles.find((s) => s.id === selectedStyle)
                      ?.estimatedTime || "5m"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationPage;
