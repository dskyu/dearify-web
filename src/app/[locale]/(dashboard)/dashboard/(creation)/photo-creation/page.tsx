"use client";

import React, { useState, useCallback } from "react";
import {
  ImageIcon,
  Sparkles,
  Palette,
  Camera,
  Wand2,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Download,
  Share2,
  RotateCcw,
  Settings,
  Sliders,
  Brush,
  Layers,
  Eye,
  EyeOff,
  Type,
  Info,
  Upload,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import DragDropUpload from "@/components/ui/drag-drop-upload";
import RealTimePreview from "@/components/ui/real-time-preview";

interface ImageStyle {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isFree?: boolean;
  isPopular?: boolean;
  credits: number;
  estimatedTime: string;
}

interface GenerationSettings {
  style: string;
  aspectRatio: string;
  enhanceQuality: boolean;
  watermark: boolean;
  model: string;
  seed?: number;
}

const ImageGenerationPage = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const MAX_REFERENCE_PHOTOS = 3;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("free-style");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    style: "free-style",
    aspectRatio: "1:1",
    enhanceQuality: false,
    watermark: false,
    model: "nano-banana",
  });

  const models = [
    {
      id: "nano-banana",
      name: "Nano Banana",
      icon: "🍌",
      credits: 5,
      description:
        "Google's advanced image editing model, unmatched character consistency.",
    },
    {
      id: "seedream",
      name: "Seedream 4.0",
      icon: "🌊",
      credits: 4,
      description:
        "Precise control over multiple images with stunning quality.",
    },
    {
      id: "qwen",
      name: "Qwen",
      icon: "🔮",
      credits: 3,
      description: "Great at reading and creating clear text inside images.",
    },
    {
      id: "gpt-image-1",
      name: "GPT Image 1 Low",
      icon: "🤖",
      credits: 4,
      description: "Advanced AI model with high-quality output.",
    },
  ];

  const imageStyles: ImageStyle[] = [
    {
      id: "free-style",
      name: "Free Style",
      description: "No specific template, let AI create freely",
      thumbnail: "https://picsum.photos/300/300?random=0",
      category: "General",
      isPopular: true,
      credits: 3,
      estimatedTime: "25s",
    },
    {
      id: "realistic-portrait",
      name: "Realistic Portrait",
      description: "Professional headshots and portraits with natural lighting",
      thumbnail: "https://picsum.photos/300/300?random=1",
      category: "Portrait",
      isPopular: true,
      credits: 5,
      estimatedTime: "30s",
    },
    {
      id: "anime-style",
      name: "Anime Style",
      description: "Transform photos into Japanese anime artwork",
      thumbnail: "https://picsum.photos/300/300?random=2",
      category: "Art Style",
      isFree: true,
      credits: 3,
      estimatedTime: "45s",
    },
    {
      id: "oil-painting",
      name: "Oil Painting",
      description: "Classical oil painting effects with rich textures",
      thumbnail: "https://picsum.photos/300/300?random=3",
      category: "Art Style",
      credits: 4,
      estimatedTime: "60s",
    },
    {
      id: "watercolor",
      name: "Watercolor",
      description: "Soft watercolor painting with flowing colors",
      thumbnail: "https://picsum.photos/300/300?random=4",
      category: "Art Style",
      credits: 4,
      estimatedTime: "50s",
    },
    {
      id: "digital-art",
      name: "Digital Art",
      description: "Modern digital artwork with vibrant colors",
      thumbnail: "https://picsum.photos/300/300?random=5",
      category: "Art Style",
      credits: 5,
      estimatedTime: "40s",
    },
    {
      id: "sketch",
      name: "Photo to Sketch",
      description: "Convert photos into pencil sketch drawings",
      thumbnail: "https://picsum.photos/300/300?random=6",
      category: "Transform",
      isFree: true,
      credits: 2,
      estimatedTime: "25s",
    },
    {
      id: "cartoon",
      name: "Photo to Cartoon",
      description: "Transform photos into cartoon illustrations",
      thumbnail: "https://picsum.photos/300/300?random=7",
      category: "Transform",
      credits: 3,
      estimatedTime: "35s",
    },
    {
      id: "pixar-style",
      name: "Pixar Style",
      description: "3D animated style like Pixar movies",
      thumbnail: "https://picsum.photos/300/300?random=8",
      category: "3D Style",
      isPopular: true,
      credits: 6,
      estimatedTime: "90s",
    },
  ];

  const categories = [
    { name: "All", count: imageStyles.length },
    {
      name: "Art Style",
      count: imageStyles.filter((e) => e.category === "Art Style").length,
    },
    {
      name: "Transform",
      count: imageStyles.filter((e) => e.category === "Transform").length,
    },
    {
      name: "Portrait",
      count: imageStyles.filter((e) => e.category === "Portrait").length,
    },
    {
      name: "3D Style",
      count: imageStyles.filter((e) => e.category === "3D Style").length,
    },
  ];

  const handleFileSelect = useCallback(
    (file: File) => {
      if (selectedFiles.length < MAX_REFERENCE_PHOTOS) {
        setSelectedFiles((prev) => [...prev, file]);
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, url]);
      }
    },
    [selectedFiles.length],
  );

  const handleFileRemove = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [previewUrls],
  );

  const handleGenerate = async () => {
    if (!textPrompt && selectedFiles.length === 0) return;

    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setGeneratedImage("https://picsum.photos/800/800?random=999");
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      const model = models.find((m) => m.id === settings.model);
      const modelName = model?.name || "unknown";
      link.download = `generated-photo-${modelName}-${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleShare = () => {
    if (generatedImage && navigator.share) {
      navigator.share({
        title: "AI Generated Image",
        text: "Check out this amazing AI-generated image!",
        url: generatedImage,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Interface */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-120 lg:min-w-120 lg:max-w-120 space-y-2">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog
                open={isTemplateDialogOpen}
                onOpenChange={setIsTemplateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start gap-3 p-3"
                  >
                    {imageStyles.find((s) => s.id === selectedStyle) ? (
                      <>
                        <img
                          src={
                            imageStyles.find((s) => s.id === selectedStyle)
                              ?.thumbnail
                          }
                          alt={
                            imageStyles.find((s) => s.id === selectedStyle)
                              ?.name
                          }
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-medium">
                            {
                              imageStyles.find((s) => s.id === selectedStyle)
                                ?.name
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {
                              imageStyles.find((s) => s.id === selectedStyle)
                                ?.description
                            }
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Palette className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm text-gray-500">
                            Select a template
                          </span>
                          <span className="text-xs text-gray-400">
                            Choose a style for your photo
                          </span>
                        </div>
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Choose Template</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {imageStyles.map((style) => (
                      <div
                        key={style.id}
                        className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
                        onClick={() => {
                          setSelectedStyle(style.id);
                          setIsTemplateDialogOpen(false);
                        }}
                      >
                        <div className="relative">
                          <img
                            src={style.thumbnail}
                            alt={style.name}
                            className={cn(
                              "w-36 h-36 rounded-lg object-cover",
                              selectedStyle === style.id
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : "",
                            )}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <span className="text-sm font-medium block">
                            {style.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {style.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Combined Prompt and Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Describe Your Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., A cute orange cat sitting on a windowsill, warm sunlight streaming through the window, realistic style, high quality"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                className="min-h-[200px] resize-none"
              />

              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-3 w-3" />
                  <span className="text-xs font-medium text-gray-600">
                    Reference Photos (Optional)
                  </span>
                </div>

                {/* Photo Grid with Upload */}
                <div className="grid grid-cols-3 gap-1 mt-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={url}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleFileRemove(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {previewUrls.length < MAX_REFERENCE_PHOTOS && (
                    <div className="aspect-square">
                      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center p-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                          className="hidden"
                          id={`upload-${previewUrls.length}`}
                        />
                        <label
                          htmlFor={`upload-${previewUrls.length}`}
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-4 w-4 text-gray-500 mb-1" />
                          <span className="text-xs text-gray-600">Upload</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Model</Label>
                <Select
                  value={settings.model}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, model: value }))
                  }
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a model">
                      {models.find((m) => m.id === settings.model) && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {models.find((m) => m.id === settings.model)?.icon}
                          </span>
                          <span className="font-medium text-sm">
                            {models.find((m) => m.id === settings.model)?.name}
                          </span>
                          <span className="text-xs text-green-600 ml-2">
                            🍃
                          </span>
                          <span className="text-xs text-gray-500">
                            {
                              models.find((m) => m.id === settings.model)
                                ?.credits
                            }
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem
                        key={model.id}
                        value={model.id}
                        className={cn(
                          // If this model is selected, always add hover/active styles
                          settings.model === model.id &&
                            "bg-muted hover:bg-muted/80 dark:bg-muted dark:hover:bg-muted/80", // shadcn default
                        )}
                      >
                        <div className="flex items-center gap-3 w-full py-2">
                          <span className="text-lg">{model.icon}</span>
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center">
                              <span className="font-medium text-sm">
                                {model.name}
                              </span>
                              <div className="flex items-center gap-1 ml-4">
                                <span className="text-xs text-green-600">
                                  🍃
                                </span>
                                <span className="text-xs text-gray-500">
                                  {model.credits}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {model.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Aspect Ratio</Label>
                <div className="grid grid-cols-5 gap-2">
                  {["1:1", "16:9", "9:16", "4:3", "3:4"].map((ratio) => (
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
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="enhance-quality"
                    className="text-sm font-medium"
                  >
                    Enhance Quality
                  </Label>
                  <Switch
                    id="enhance-quality"
                    checked={settings.enhanceQuality}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        enhanceQuality: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="watermark" className="text-sm font-medium">
                    No Watermark
                  </Label>
                  <Switch
                    id="watermark"
                    checked={settings.watermark}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        watermark: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={
              (!textPrompt && selectedFiles.length === 0) || isGenerating
            }
            className="w-full h-14 bg-primary hover:from-purple-600 hover:to-pink-600 rounded-full text-md font-bold mt-5"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Photo
                {(textPrompt || selectedFiles.length > 0) && (
                  <>
                    <span className="text-xs px-2 py-1 flex items-center gap-1">
                      🍃{" "}
                      {models.find((m) => m.id === settings.model)?.credits ||
                        0}
                    </span>
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Preview & Results */}
        <div className="flex-1 flex flex-col justify-end">
          {isGenerating ? (
            /* Loading State */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  Generating Your Photo
                </CardTitle>
                <CardDescription>
                  AI is creating your masterpiece, please wait...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Generating...
                    </p>
                    <p className="text-sm text-gray-500">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : generatedImage ? (
            /* Generated Result */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generated Result
                </CardTitle>
                <CardDescription>
                  Your AI-generated photo is ready!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <RealTimePreview
                    type="image"
                    src={generatedImage}
                    alt="Generated image"
                    className="w-full h-full"
                    showControls={false}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleDownload}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleShare}
                      className="h-8 w-8 p-0"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Pre-generation State - Template Description & Preview */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Template Preview
                </CardTitle>
                <CardDescription>
                  {imageStyles.find((s) => s.id === selectedStyle)
                    ?.description || "Select a template to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 ">
                  {/* Template Preview */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden ">
                    <img
                      src={
                        imageStyles.find((s) => s.id === selectedStyle)
                          ?.thumbnail ||
                        "https://picsum.photos/400/400?random=0"
                      }
                      alt={
                        imageStyles.find((s) => s.id === selectedStyle)?.name ||
                        "Template preview"
                      }
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">
                        {imageStyles.find((s) => s.id === selectedStyle)
                          ?.name || "Free Style"}
                      </h3>
                      <p className="text-sm opacity-90">
                        {imageStyles.find((s) => s.id === selectedStyle)
                          ?.description ||
                          "No specific template, let AI create freely"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationPage;
