"use client";

import React, { useState, useCallback, useMemo } from "react";
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
  Search,
  X,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import RealTimePreview from "@/components/ui/real-time-preview";
import { TemplateItem, templatesConfig } from "@/lib/templates";

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
  const [currentAssetUuid, setCurrentAssetUuid] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>("idle");
  const [selectedStyle, setSelectedStyle] = useState<string>("free-style");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [templateSearchText, setTemplateSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [settings, setSettings] = useState<GenerationSettings>({
    style: "free-style",
    aspectRatio: "1:1",
    enhanceQuality: false,
    watermark: false,
    model: "stable-diffusion",
  });

  const models = [
    {
      id: "stable-diffusion",
      name: "Stable Diffusion",
      icon: "🎨",
      credits: 3,
      description: "High-quality image generation",
    },
    {
      id: "flux-schnell",
      name: "Flux Schnell",
      icon: "⚡",
      credits: 3,
      description: "High-quality, fast image generation",
    },
    {
      id: "flux-dev",
      name: "Flux Dev",
      icon: "🔧",
      credits: 8,
      description: "Advanced image generation with more control",
    },
    {
      id: "dall-e-3",
      name: "DALL-E 3",
      icon: "🤖",
      credits: 8,
      description: "OpenAI's advanced image generation model",
    },
  ];

  const templates: TemplateItem[] = [
    ...templatesConfig.filter((t) => t.type === "image"),
  ];

  // Helper function to get template with fallback to free-style
  const getTemplate = (slug: string): TemplateItem => {
    const foundTemplate = templates.find((t) => t.slug === slug);
    if (foundTemplate) {
      return foundTemplate;
    }

    const freeStyleTemplate = templates.find((t) => t.slug === "free-style");
    return freeStyleTemplate!;
  };

  // Extract all unique tags from templates
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    templates.forEach((template) => {
      template.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [templates]);

  // Filter templates based on search text and selected tag
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // Text search filter
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

      // Tag filter
      const matchesTag =
        selectedTag === "all" || template.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [templates, templateSearchText, selectedTag]);

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
    setGeneratedImage(null);
    setGenerationStatus("starting");

    try {
      // Prepare reference images URLs
      const referenceImageUrls =
        previewUrls.length > 0 ? previewUrls : undefined;

      // Call the async API
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
          watermark: settings.watermark,
          referenceImage: referenceImageUrls?.[0], // Use first reference image
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
        // Start polling for status updates
        pollGenerationStatus(result.assetUuid);
      } else {
        throw new Error("No asset UUID returned from API");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationStatus("failed");
      alert(
        `Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Poll generation status
  const pollGenerationStatus = useCallback(async (assetUuid: string) => {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxPollTime = 300000; // Max 5 minutes
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
            alert(`Generation failed: ${result.error || "Unknown error"}`);
            return;
          } else if (result.status === "processing") {
            // Continue polling
            if (Date.now() - startTime < maxPollTime) {
              setTimeout(poll, pollInterval);
            } else {
              setGenerationStatus("timeout");
              setIsGenerating(false);
              alert("Generation timeout. Please try again.");
            }
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
        setGenerationStatus("error");
        setIsGenerating(false);
        alert("Failed to check generation status. Please refresh the page.");
      }
    };

    // Start polling
    setTimeout(poll, pollInterval);
  }, []);

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
                              {template.slug
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <span className="text-xs text-gray-500">
                              {template.image_settings?.prompt ||
                                "AI-generated image"}
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
                            setSelectedStyle(template.slug);
                            setIsTemplateDialogOpen(false);
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
              (!textPrompt && selectedFiles.length === 0) ||
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
                        Task ID: {currentAssetUuid.slice(0, 8)}...
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
                  {getTemplate(selectedStyle).image_settings?.prompt ||
                    "Select a template to see preview"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 ">
                  {/* Template Preview */}
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden ">
                    <img
                      src={getTemplate(selectedStyle).cover}
                      alt={getTemplate(selectedStyle).slug}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold">
                        {getTemplate(selectedStyle)
                          .slug.replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h3>
                      <p className="text-sm opacity-90">
                        {getTemplate(selectedStyle).image_settings?.prompt ||
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
