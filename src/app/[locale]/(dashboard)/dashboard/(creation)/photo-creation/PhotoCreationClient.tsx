"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import ReactCompareImage from "react-compare-image";
import {
  Sparkles,
  Palette,
  Camera,
  Wand2,
  Download,
  Share2,
  Settings,
  Eye,
  Crown,
  AlertCircle,
  Type,
  Upload,
  Search,
  X,
  ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { TemplateItem } from "@/types/blocks/templates";
import { toast } from "sonner";

// Text Section Component
interface TextSectionProps {
  textPrompt: string;
  setTextPrompt: (value: string) => void;
  requiredPrompt: boolean;
  placeholder: string;
}

const TextSection = memo(
  ({
    textPrompt,
    setTextPrompt,
    requiredPrompt,
    placeholder,
  }: TextSectionProps) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">
          Text Description {requiredPrompt ? "(Required)" : "(Optional)"}
        </span>
      </div>
      <Textarea
        placeholder={placeholder}
        value={textPrompt}
        onChange={(e) => setTextPrompt(e.target.value)}
        className="min-h-[200px] resize-none"
      />
    </div>
  ),
);

TextSection.displayName = "TextSection";

// Image Section Component
interface ImageSectionProps {
  previewUrls: string[];
  handleFileSelect: (file: File) => void;
  handleFileRemove: (index: number) => void;
  requirementText: string;
  maxPhotos: number;
}

const ImageSection = memo(
  ({
    previewUrls,
    handleFileSelect,
    handleFileRemove,
    requirementText,
    maxPhotos,
  }: ImageSectionProps) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">
          Reference Photos {requirementText}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
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
        {previewUrls.length < maxPhotos && (
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
  ),
);

ImageSection.displayName = "ImageSection";

interface GenerationSettings {
  style: string;
  aspectRatio: string;
  enhanceQuality: boolean;
  noWatermark: boolean;
  model: string;
}

export default function PhotoCreationClient({
  templates,
}: {
  templates: TemplateItem[];
}) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentAssetUuid, setCurrentAssetUuid] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>("idle");
  const [selectedStyle, setSelectedStyle] = useState<string>("free-style");

  const MAX_REFERENCE_PHOTOS = 3;

  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [templateSearchText, setTemplateSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState<GenerationSettings>({
    style: "free-style",
    aspectRatio: "1:1",
    enhanceQuality: false,
    noWatermark: false,
    model: "nano-banana",
  });

  const getTemplate = (slug: string): TemplateItem => {
    const foundTemplate = templates.find((t) => t.slug === slug);
    if (foundTemplate) {
      return foundTemplate;
    }
    const freeStyleTemplate = templates.find((t) => t.slug === "free-style");
    return freeStyleTemplate!;
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !templateSearchText ||
        template.slug
          .toLowerCase()
          .includes(templateSearchText.toLowerCase()) ||
        template.image_settings?.prompt
          ?.toLowerCase()
          .includes(templateSearchText.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(templateSearchText.toLowerCase()),
        );

      const matchesTag =
        selectedTag === "all" || template.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [templates, templateSearchText, selectedTag]);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxFileSize) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const currentTemplate = getTemplate(selectedStyle);
      const requiredReferenceCount =
        currentTemplate.image_settings?.required_reference_image_count;

      // If required_reference_image_count is specified, use that as the limit
      // Otherwise, use the default MAX_REFERENCE_PHOTOS
      const maxPhotos = requiredReferenceCount || MAX_REFERENCE_PHOTOS;

      if (selectedFiles.length < maxPhotos) {
        setSelectedFiles((prev) => [...prev, file]);
        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, url]);
      }
    },
    [selectedFiles.length, selectedStyle],
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
    const currentTemplate = getTemplate(selectedStyle);
    const requiredPrompt =
      currentTemplate.image_settings?.required_prompt ?? false;
    const requiredReferenceImage =
      currentTemplate.image_settings?.required_reference_image ?? false;
    const requiredReferenceCount =
      currentTemplate.image_settings?.required_reference_image_count ?? 0;

    // Check if required prompt is provided
    if (requiredPrompt && !textPrompt) return;

    // Check if at least one reference image is required
    if (requiredReferenceImage && selectedFiles.length === 0) return;

    // Check if specific number of reference images is required
    if (requiredReferenceCount > 0) {
      if (selectedFiles.length !== requiredReferenceCount) return;
    }

    // For text-to-image, we need either text prompt or reference images if not required
    if (!requiredPrompt && !textPrompt && selectedFiles.length === 0) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    setGenerationStatus("starting");

    try {
      let referenceImageUrls: string[] | undefined = undefined;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const uploadResp = await fetch("/api/upload-reference-images", {
          method: "POST",
          body: formData,
        });
        if (!uploadResp.ok) {
          const err = await uploadResp.json().catch(() => ({}));
          throw new Error(err.error || "Failed to upload reference images");
        }
        const uploadData = await uploadResp.json();
        referenceImageUrls =
          uploadData.data?.urls || uploadData.urls || undefined;
      } else if (previewUrls.length > 0) {
        referenceImageUrls = previewUrls;
      }

      const response = await fetch("/api/ai/generate-image-async", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: textPrompt,
          model: settings.model,
          aspectRatio: settings.aspectRatio,
          enhanceQuality: settings.enhanceQuality,
          noWatermark: settings.noWatermark,
          referenceImages: referenceImageUrls,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start image generation");
      }

      const result = await response.json();

      if (result.success && result.assetUuid) {
        setCurrentAssetUuid(result.assetUuid);
        setGenerationStatus("processing");
        pollGenerationStatus(result.assetUuid);
      } else {
        throw new Error("No asset UUID returned from API");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationStatus("failed");
      toast.error(
        `Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = useCallback(async (assetUuid: string) => {
    const pollInterval = 2000;
    const maxPollTime = 60000;
    const startTime = Date.now();

    const poll = async () => {
      try {
        const response = await fetch(`/api/ai/asset-status/${assetUuid}`);
        if (!response.ok) {
          throw new Error("Failed to check generation status");
        }
        const result = await response.json();
        if (result.success) {
          if (result.status === "completed" && result.resultUrl) {
            setGeneratedImage(result.resultUrl);
            setGenerationStatus("completed");
            setIsGenerating(false);
            return;
          } else if (result.status === "failed") {
            setGenerationStatus("failed");
            setIsGenerating(false);
            toast.error(
              `Generation failed: ${result.error || "Unknown error"}`,
            );
            return;
          } else if (result.status === "processing") {
            if (Date.now() - startTime < maxPollTime) {
              setTimeout(poll, pollInterval);
            } else {
              setGenerationStatus("timeout");
              setIsGenerating(false);
              toast.warning("Generation timeout. Please try again.");
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
        setGenerationStatus("error");
        setIsGenerating(false);
        toast.error(
          "Failed to check generation status. Please refresh the page.",
        );
      }
    };

    setTimeout(poll, pollInterval);
  }, []);

  const handleDownload = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `dearify-generated-photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download failed:", error);
        toast.error("Failed to download image. Please try again.");
      }
    }
  };

  // Carousel API setup
  React.useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

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
                    {(() => {
                      const template = getTemplate(selectedStyle);
                      return (
                        <>
                          <img
                            src={template.cover}
                            alt={template.slug}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex flex-col items-start text-left">
                            <span className="text-sm font-medium">
                              {template.title || template.slug}
                            </span>
                            <span className="text-xs text-gray-500 truncate max-w-[20rem] block whitespace-nowrap overflow-hidden">
                              {template.description || ""}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Choose Template</DialogTitle>
                  </DialogHeader>

                  {/* Search and Filter Controls */}
                  <div className="space-y-4 p-4 border-b">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search templates..."
                        value={templateSearchText}
                        onChange={(e) => setTemplateSearchText(e.target.value)}
                        className="pl-10"
                      />
                      {templateSearchText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setTemplateSearchText("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Tag Filter */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedTag === "all" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedTag("all")}
                      >
                        All
                      </Badge>
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4">
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <div
                          key={template.slug}
                          className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
                          onClick={() => {
                            // Check if generation is in progress
                            if (
                              isGenerating ||
                              generationStatus === "processing" ||
                              generationStatus === "starting"
                            ) {
                              toast.error(
                                "Cannot switch template during generation. Please wait for the current generation to complete.",
                              );
                              return;
                            }

                            setSelectedStyle(template.slug);
                            setIsTemplateDialogOpen(false);

                            // Reset generation results when switching templates
                            setGeneratedImage(null);
                            setCurrentAssetUuid(null);
                            setGenerationStatus("idle");
                          }}
                        >
                          <div className="relative">
                            <img
                              src={template.cover}
                              alt={template.slug}
                              className={cn(
                                "w-36 h-36 rounded-lg object-cover",
                                selectedStyle === template.slug
                                  ? "ring-2 ring-blue-500 ring-offset-2"
                                  : "",
                              )}
                            />
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-sm font-medium block">
                              {template.slug
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 block">
                              {template.image_settings?.prompt ||
                                "AI-generated image"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No templates found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setTemplateSearchText("");
                            setSelectedTag("all");
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Main Content Area - Dynamic Layout Based on Template Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Describe Your Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(() => {
                const currentTemplate = getTemplate(selectedStyle);
                const isImageToImage =
                  currentTemplate.image_settings?.type === "image-to-image";
                const requiredPrompt =
                  currentTemplate.image_settings?.required_prompt ?? false;
                const requiredReferenceImage =
                  currentTemplate.image_settings?.required_reference_image ??
                  false;
                const requiredReferenceCount =
                  currentTemplate.image_settings
                    ?.required_reference_image_count ?? 0;

                // Get image requirement text
                const getImageRequirementText = () => {
                  if (requiredReferenceCount > 0) {
                    return `(Required: ${requiredReferenceCount})`;
                  } else if (requiredReferenceImage) {
                    return `(Required: at least 1, up to ${MAX_REFERENCE_PHOTOS})`;
                  } else {
                    return `(Optional, up to ${MAX_REFERENCE_PHOTOS})`;
                  }
                };

                // Get text placeholder
                const getTextPlaceholder = () => {
                  return requiredPrompt
                    ? "Describe your photo in detail..."
                    : "Add additional description to guide the AI transformation...";
                };

                // Get max photos for upload
                const maxPhotos =
                  requiredReferenceCount || MAX_REFERENCE_PHOTOS;

                // Return layout based on template type
                if (isImageToImage) {
                  // Image-to-image: Images first, then text
                  return (
                    <>
                      <ImageSection
                        previewUrls={previewUrls}
                        handleFileSelect={handleFileSelect}
                        handleFileRemove={handleFileRemove}
                        requirementText={getImageRequirementText()}
                        maxPhotos={maxPhotos}
                      />
                      <TextSection
                        textPrompt={textPrompt}
                        setTextPrompt={setTextPrompt}
                        requiredPrompt={requiredPrompt}
                        placeholder={getTextPlaceholder()}
                      />
                    </>
                  );
                } else {
                  // Text-to-image: Text first, then images
                  return (
                    <>
                      <TextSection
                        textPrompt={textPrompt}
                        setTextPrompt={setTextPrompt}
                        requiredPrompt={requiredPrompt}
                        placeholder={getTextPlaceholder()}
                      />
                      <ImageSection
                        previewUrls={previewUrls}
                        handleFileSelect={handleFileSelect}
                        handleFileRemove={handleFileRemove}
                        requirementText={getImageRequirementText()}
                        maxPhotos={maxPhotos}
                      />
                    </>
                  );
                }
              })()}
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
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    Enhance Quality
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex cursor-help text-muted-foreground">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Enhance image resolution and details (Pro or higher)
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
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
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="watermark"
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    No Watermark
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex cursor-help text-muted-foreground">
                          <AlertCircle className="h-3.5 w-3.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Generate images without watermark (Pro or higher)
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <Switch
                      id="watermark"
                      checked={settings.noWatermark}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          noWatermark: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={
              (() => {
                const currentTemplate = getTemplate(selectedStyle);
                const requiredPrompt =
                  currentTemplate.image_settings?.required_prompt ?? false;
                const requiredReferenceImage =
                  currentTemplate.image_settings?.required_reference_image ??
                  false;
                const requiredReferenceCount =
                  currentTemplate.image_settings
                    ?.required_reference_image_count ?? 0;

                // Check if required prompt is provided
                if (requiredPrompt && !textPrompt) return true;

                // Check if at least one reference image is required
                if (requiredReferenceImage && selectedFiles.length === 0)
                  return true;

                // Check if specific number of reference images is required
                if (
                  requiredReferenceCount > 0 &&
                  selectedFiles.length !== requiredReferenceCount
                )
                  return true;

                // For text-to-image, we need either text prompt or reference images if not required
                if (
                  !requiredPrompt &&
                  !textPrompt &&
                  selectedFiles.length === 0
                )
                  return true;

                return false;
              })() ||
              isGenerating ||
              generationStatus === "processing" ||
              generationStatus === "starting"
            }
            className="w-full h-14 bg-primary hover:from-purple-600 hover:to-pink-600 rounded-full text-md font-bold mt-5"
            size="lg"
          >
            {isGenerating ||
            generationStatus === "processing" ||
            generationStatus === "starting" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {generationStatus === "starting"
                  ? "Starting..."
                  : "Generating..."}
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Photo
                {(textPrompt || selectedFiles.length > 0) && (
                  <>
                    <span className="text-xs px-2 py-1 flex items-center gap-1">
                      🍃 5
                    </span>
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Preview & Results */}
        <div className="flex-1 flex flex-col justify-end">
          {isGenerating || generationStatus === "processing" ? (
            /* Loading State */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  {generationStatus === "starting"
                    ? "Starting Generation..."
                    : "Generating Your Photo"}
                </CardTitle>
                <CardDescription>
                  {generationStatus === "starting"
                    ? "Preparing your request..."
                    : "AI is creating your masterpiece, please wait..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {generationStatus === "starting"
                        ? "Starting..."
                        : "Generating..."}
                    </p>
                    <p className="text-sm text-gray-500">
                      {generationStatus === "starting"
                        ? "Setting up your generation task"
                        : "This may take a few moments"}
                    </p>
                    {currentAssetUuid && (
                      <p className="text-xs text-gray-400 mt-2">
                        Task ID: {currentAssetUuid}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : generationStatus === "failed" ? (
            /* Failed State */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  Generation Failed
                </CardTitle>
                <CardDescription>
                  Something went wrong during generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <X className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Generation Failed
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Please try again with different settings
                    </p>
                    <Button
                      onClick={() => {
                        setGenerationStatus("idle");
                        setCurrentAssetUuid(null);
                      }}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : generatedImage ? (
            /* Generated Result */
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generated Result
                    </CardTitle>
                    <CardDescription>
                      Your AI-generated photo is ready!
                    </CardDescription>
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleDownload}
                    className="h-9 w-9"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30 md:h-[70vh]">
                  <img
                    src={generatedImage}
                    alt="Generated image"
                    className="max-h-full max-w-full object-contain"
                    style={{ display: "block" }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Pre-generation State - Template Description & Preview */
            <Card>
              <CardHeader className="flex flex-col items-center justify-center text-center">
                <CardTitle className="flex items-center gap-2 justify-center text-2xl font-bold">
                  {getTemplate(selectedStyle).title}
                </CardTitle>
                <CardDescription className="text-md">
                  {getTemplate(selectedStyle).description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Template Preview Carousel */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-4xl px-12">
                      <Carousel
                        setApi={setCarouselApi}
                        opts={{
                          align: "start",
                          loop: true,
                          dragFree: false,
                          containScroll: "trimSnaps",
                          skipSnaps: false,
                          watchDrag: false,
                        }}
                        className="w-full [&_.embla__container]:pointer-events-none [&_.embla__slide]:pointer-events-auto [&_.embla__viewport]:overflow-hidden [&_.embla__container]:touch-none [&_.embla__container]:select-none"
                      >
                        <CarouselContent>
                          {getTemplate(selectedStyle).compare
                            ? // Compare mode - group samples in pairs
                              Array.from({
                                length: Math.ceil(
                                  getTemplate(selectedStyle).samples.length / 2,
                                ),
                              }).map((_, groupIndex) => {
                                const leftImage =
                                  getTemplate(selectedStyle).samples[
                                    groupIndex * 2
                                  ];
                                const rightImage =
                                  getTemplate(selectedStyle).samples[
                                    groupIndex * 2 + 1
                                  ];

                                return (
                                  <CarouselItem key={groupIndex}>
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                      <ReactCompareImage
                                        aspectRatio="wider"
                                        leftImage={leftImage}
                                        rightImage={rightImage || leftImage} // Use left image as fallback if no right image
                                        sliderLineColor="#ffffff"
                                        sliderPositionPercentage={0.5}
                                        handle={
                                          <div className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center">
                                            <svg
                                              width="18"
                                              height="18"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              className="text-gray-700"
                                            >
                                              <polyline points="10 8 6 12 10 16" />
                                              <polyline points="14 8 18 12 14 16" />
                                            </svg>
                                          </div>
                                        }
                                      />
                                    </div>
                                  </CarouselItem>
                                );
                              })
                            : // Normal mode - single images
                              getTemplate(selectedStyle).samples.map(
                                (sample, index) => (
                                  <CarouselItem key={index}>
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                      <img
                                        src={sample}
                                        alt={`${getTemplate(selectedStyle).slug} sample ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </CarouselItem>
                                ),
                              )}
                        </CarouselContent>
                        {(getTemplate(selectedStyle).compare
                          ? Math.ceil(
                              getTemplate(selectedStyle).samples.length / 2,
                            )
                          : getTemplate(selectedStyle).samples.length) > 1 && (
                          <>
                            <CarouselPrevious className="-left-12 bg-white shadow-lg hover:scale-110 transition-transform" />
                            <CarouselNext className="-right-12 bg-white shadow-lg hover:scale-110 transition-transform" />
                          </>
                        )}
                      </Carousel>

                      {/* Dots indicator */}
                      {(getTemplate(selectedStyle).compare
                        ? Math.ceil(
                            getTemplate(selectedStyle).samples.length / 2,
                          )
                        : getTemplate(selectedStyle).samples.length) > 1 && (
                        <div className="flex justify-center mt-4 gap-2">
                          {Array.from({
                            length: getTemplate(selectedStyle).compare
                              ? Math.ceil(
                                  getTemplate(selectedStyle).samples.length / 2,
                                )
                              : count,
                          }).map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === current - 1
                                  ? "bg-purple-500 w-6"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                              onClick={() => carouselApi?.scrollTo(index)}
                            />
                          ))}
                        </div>
                      )}
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
}
