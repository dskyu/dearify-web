"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Music4,
  Sparkles,
  Headphones,
  Mic,
  Volume2,
  ArrowRight,
  Star,
  Clock,
  Zap,
  BarChart3,
  Play,
  Pause,
  Download,
  Share2,
  Settings,
  Sliders,
  MicIcon,
  Music,
  FileAudio,
  StopCircle,
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
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import DragDropUpload from "@/components/ui/drag-drop-upload";
import RealTimePreview from "@/components/ui/real-time-preview";

interface AudioStyle {
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

interface AudioSettings {
  style: string;
  duration: number;
  tempo: number;
  key: string;
  mood: string;
  instruments: string[];
  voiceType?: string;
  language?: string;
}

const AudioGenerationPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("ambient-music");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [settings, setSettings] = useState<AudioSettings>({
    style: "ambient-music",
    duration: 30,
    tempo: 120,
    key: "C",
    mood: "calm",
    instruments: ["piano", "strings"],
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const audioStyles: AudioStyle[] = [
    {
      id: "ambient-music",
      name: "Ambient Music",
      description: "Relaxing ambient soundscapes and atmospheric music",
      thumbnail: "https://picsum.photos/300/300?random=13",
      category: "Background Music",
      isPopular: true,
      credits: 8,
      estimatedTime: "2m",
      duration: "30s-5m",
    },
    {
      id: "cinematic-score",
      name: "Cinematic Score",
      description: "Epic orchestral music for films and videos",
      thumbnail: "https://picsum.photos/300/300?random=14",
      category: "Background Music",
      credits: 12,
      estimatedTime: "3m",
      duration: "1m-10m",
    },
    {
      id: "lofi-beats",
      name: "Lo-Fi Beats",
      description: "Chill lo-fi hip hop beats for studying and relaxation",
      thumbnail: "https://picsum.photos/300/300?random=15",
      category: "Background Music",
      isFree: true,
      credits: 6,
      estimatedTime: "90s",
      duration: "2m-8m",
    },
    {
      id: "voice-synthesis",
      name: "Voice Synthesis",
      description: "AI-generated human-like voice from text",
      thumbnail: "https://picsum.photos/300/300?random=17",
      category: "Voice",
      isPopular: true,
      credits: 10,
      estimatedTime: "1m",
      duration: "5s-2m",
    },
    {
      id: "nature-sounds",
      name: "Nature Sounds",
      description: "Rain, ocean waves, forest sounds, and more",
      thumbnail: "https://picsum.photos/300/300?random=18",
      category: "Ambient",
      isFree: true,
      credits: 3,
      estimatedTime: "45s",
      duration: "1m-60m",
    },
    {
      id: "electronic-beats",
      name: "Electronic Beats",
      description: "Modern electronic and EDM music",
      thumbnail: "https://picsum.photos/300/300?random=20",
      category: "Background Music",
      credits: 9,
      estimatedTime: "2m",
      duration: "2m-6m",
    },
  ];

  const categories = [
    { name: "All", count: audioStyles.length },
    {
      name: "Background Music",
      count: audioStyles.filter((e) => e.category === "Background Music")
        .length,
    },
    {
      name: "Voice",
      count: audioStyles.filter((e) => e.category === "Voice").length,
    },
    {
      name: "Ambient",
      count: audioStyles.filter((e) => e.category === "Ambient").length,
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setGeneratedAudio(
        "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      );
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (generatedAudio) {
      const link = document.createElement("a");
      link.href = generatedAudio;
      link.download = `generated-music-${Date.now()}.wav`;
      link.click();
    }
  };

  const handleShare = () => {
    if (generatedAudio && navigator.share) {
      navigator.share({
        title: "AI Generated Music",
        text: "Check out this amazing AI-generated music!",
        url: generatedAudio,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
            <Music4 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            AI Music Generation
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create professional music content with AI. Generate music, voice
          synthesis, and sound effects from text or audio input.
        </p>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Input Method
              </CardTitle>
              <CardDescription>
                Choose how you want to create your music content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text to Music</TabsTrigger>
                  <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                  <TabsTrigger value="record">Record Voice</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-prompt">Describe your music</Label>
                    <Textarea
                      id="text-prompt"
                      placeholder="Describe the music you want to generate... e.g., 'A calm piano melody with soft strings in the background'"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <DragDropUpload
                    accept="audio/*"
                    maxSize={50}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    selectedFile={selectedFile}
                    placeholder="拖拽音频文件到此处或点击上传"
                    description="支持 MP3, WAV, M4A 格式，最大 50MB"
                  />
                </TabsContent>

                <TabsContent value="record" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={cn(
                          "w-20 h-20 rounded-full",
                          isRecording
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600",
                        )}
                      >
                        {isRecording ? (
                          <StopCircle className="h-8 w-8 text-white" />
                        ) : (
                          <Mic className="h-8 w-8 text-white" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {isRecording
                        ? "Recording... Click to stop"
                        : "Click to start recording"}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {(previewUrl || recordedAudio) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimePreview
                  type="audio"
                  src={previewUrl || recordedAudio || ""}
                  alt="Audio preview"
                  className="w-full"
                  showControls={true}
                />
              </CardContent>
            </Card>
          )}

          {/* Generated Result */}
          {generatedAudio && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generated Audio
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
                  type="audio"
                  src={generatedAudio}
                  alt="Generated audio"
                  className="w-full"
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
                <Music4 className="h-5 w-5" />
                Choose Style
              </CardTitle>
              <CardDescription>
                Select an AI style for your music generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedStyle} onValueChange={setSelectedStyle}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="all">All Styles</TabsTrigger>
                </TabsList>
                <TabsContent value="popular" className="space-y-3">
                  {audioStyles
                    .filter((style) => style.isPopular)
                    .map((style) => (
                      <div
                        key={style.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                          selectedStyle === style.id
                            ? "border-blue-500 bg-blue-50"
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
                  {audioStyles.map((style) => (
                    <div
                      key={style.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedStyle === style.id
                          ? "border-blue-500 bg-blue-50"
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
                Music Settings
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

              {/* Tempo */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tempo (BPM)</Label>
                <div className="space-y-2">
                  <Slider
                    value={[settings.tempo]}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        tempo: value[0],
                      }))
                    }
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>60</span>
                    <span>{settings.tempo} BPM</span>
                    <span>200</span>
                  </div>
                </div>
              </div>

              {/* Key */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Musical Key</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["C", "D", "E", "F", "G", "A", "B", "C#"].map((key) => (
                    <Button
                      key={key}
                      variant={settings.key === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings((prev) => ({ ...prev, key }))}
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mood</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "calm",
                    "energetic",
                    "melancholic",
                    "uplifting",
                    "dramatic",
                    "peaceful",
                  ].map((mood) => (
                    <Button
                      key={mood}
                      variant={settings.mood === mood ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings((prev) => ({ ...prev, mood }))}
                    >
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Instruments */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Instruments</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "piano",
                    "guitar",
                    "strings",
                    "drums",
                    "bass",
                    "synth",
                    "violin",
                    "flute",
                  ].map((instrument) => (
                    <Button
                      key={instrument}
                      variant={
                        settings.instruments.includes(instrument)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const newInstruments = settings.instruments.includes(
                          instrument,
                        )
                          ? settings.instruments.filter((i) => i !== instrument)
                          : [...settings.instruments, instrument];
                        setSettings((prev) => ({
                          ...prev,
                          instruments: newInstruments,
                        }));
                      }}
                    >
                      {instrument}
                    </Button>
                  ))}
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
                  (!textPrompt && !selectedFile && !recordedAudio) ||
                  isGenerating
                }
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Music className="h-5 w-5 mr-2" />
                    Generate Music
                  </>
                )}
              </Button>
              {(textPrompt || selectedFile || recordedAudio) && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    Cost:{" "}
                    {audioStyles.find((s) => s.id === selectedStyle)?.credits ||
                      0}{" "}
                    credits
                  </p>
                  <p className="text-xs text-gray-500">
                    Estimated time:{" "}
                    {audioStyles.find((s) => s.id === selectedStyle)
                      ?.estimatedTime || "2m"}
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

export default AudioGenerationPage;
