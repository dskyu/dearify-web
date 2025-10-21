"use client";

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Camera,
  Clapperboard,
  Film,
  Image as ImageIcon,
  Loader2,
  Music4,
  Palette,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/app";

// Data definitions

type MediaCategoryId = "image" | "music" | "video";

interface MediaTemplateDefaults {
  prompt?: string;
  negativePrompt?: string;
  style?: string;
  size?: string;
  mood?: string;
  genre?: string;
  duration?: string;
  tempo?: string;
  instrumentation?: string[];
  ratio?: string;
  includeVoiceover?: boolean;
  motionLevel?: string;
}

interface MediaTemplateTip {
  title: string;
  detail: string;
}

interface MediaTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  defaults?: MediaTemplateDefaults;
  recommendations?: string[];
  cheatSheet?: MediaTemplateTip[];
}

interface MediaCategory {
  id: MediaCategoryId;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  templates: MediaTemplate[];
}

interface ImageFormState {
  prompt: string;
  negativePrompt: string;
  style: string;
  size: string;
  baseImage: File | null;
  baseImagePreview: string;
}

interface MusicFormState {
  prompt: string;
  mood: string;
  genre: string;
  duration: string;
  tempo: string;
  instrumentation: string[];
  referenceFile: File | null;
}

interface VideoFormState {
  prompt: string;
  style: string;
  duration: string;
  ratio: string;
  includeVoiceover: boolean;
  motionLevel: string;
  referenceFile: File | null;
}

const imageStyleOptions = [
  "Cinematic",
  "Illustration",
  "Realistic",
  "Anime",
  "Concept Art",
  "Neon Noir",
];

const imageSizeOptions = [
  { value: "512x512", label: "512 × 512 · 头像" },
  { value: "768x1024", label: "768 × 1024 · 竖幅" },
  { value: "1024x1024", label: "1024 × 1024 · 方图" },
  { value: "1024x1536", label: "1024 × 1536 · 海报" },
];

const moodOptions = [
  { value: "romantic", label: "浪漫柔和" },
  { value: "uplifting", label: "振奋励志" },
  { value: "dreamy", label: "空灵梦幻" },
  { value: "dramatic", label: "戏剧张力" },
];

const genreOptions = [
  { value: "ambient", label: "Ambient" },
  { value: "pop", label: "Pop" },
  { value: "orchestral", label: "Orchestral" },
  { value: "electronic", label: "Electronic" },
  { value: "lofi", label: "Lo-Fi" },
];

const musicDurationOptions = [
  { value: "30", label: "30 秒预览" },
  { value: "60", label: "60 秒主段" },
  { value: "120", label: "120 秒延伸" },
];

const tempoOptions = [
  { value: "slow", label: "慢速" },
  { value: "medium", label: "中速" },
  { value: "fast", label: "快速" },
];

const instrumentOptions = [
  { value: "piano", label: "钢琴" },
  { value: "strings", label: "弦乐" },
  { value: "synth", label: "合成器" },
  { value: "percussion", label: "节奏" },
  { value: "guitar", label: "吉他" },
  { value: "vocal", label: "人声" },
];

const videoStyleOptions = [
  { value: "cinematic", label: "电影写实" },
  { value: "stylized", label: "插画风" },
  { value: "3d", label: "3D 渲染" },
  { value: "motion-graphics", label: "Motion Graphics" },
];

const videoDurationOptions = [
  { value: "10", label: "10 秒预告" },
  { value: "20", label: "20 秒故事" },
  { value: "30", label: "30 秒广告" },
  { value: "45", label: "45 秒短片" },
];

const videoRatioOptions = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "2.35:1", label: "宽银幕" },
];

const motionOptions = [
  { value: "minimal", label: "轻微运镜" },
  { value: "steady", label: "稳态推进" },
  { value: "dynamic", label: "动态运镜" },
];

const mediaCatalog: MediaCategory[] = [
  {
    id: "image",
    label: "图像工作室",
    description: "快速生成情侣、家庭与商业级别的图像素材。",
    icon: ImageIcon,
    templates: [
      {
        id: "romantic-portrait",
        name: "梦幻双人肖像",
        description: "电影级柔焦光影，适合婚礼与情侣纪念照。",
        icon: Sparkles,
        tags: ["肖像", "婚礼", "柔焦"],
        defaults: {
          prompt:
            "cinematic portrait of a smiling couple on their wedding day, golden hour light, pastel palette, 4k detail",
          negativePrompt: "blurry, distorted face, extra limbs, low-resolution",
          style: "Cinematic",
          size: "1024x1024",
        },
        recommendations: [
          "romantic close-up portrait, soft rim light, pastel colors",
          "wide environmental shot with blooming flowers, warm sunset",
          "studio portrait with silk drapery, editorial lighting",
        ],
        cheatSheet: [
          { title: "光线建议", detail: "逆光 + 柔光补光，突出肤色层次。" },
          { title: "适合场景", detail: "婚纱照、周年纪念、节日贺卡。" },
        ],
      },
      {
        id: "family-story",
        name: "家庭故事影像",
        description: "记录跨年龄家庭互动的温暖瞬间。",
        icon: Camera,
        tags: ["家庭", "纪实", "自然光"],
        defaults: {
          prompt:
            "lifestyle photo of a joyful family gathering in a sunlit living room, candid smiles, warm tones",
          negativePrompt: "staged, rigid poses, harsh shadows",
          style: "Realistic",
          size: "768x1024",
        },
        recommendations: [
          "family brunch with sunlight streaming through window",
          "grandparents hugging grandchildren in backyard",
          "evening outdoor picnic with fairy lights",
        ],
        cheatSheet: [
          { title: "构图", detail: "使用对角线连接人物关系，保留环境细节。" },
          { title: "色调", detail: "奶油暖色系提振亲密感。" },
        ],
      },
      {
        id: "fashion-lookbook",
        name: "时尚大片 Lookbook",
        description: "打造品牌级视觉大片。",
        icon: Palette,
        tags: ["时尚", "商业", "高对比"],
        defaults: {
          prompt:
            "high-fashion editorial portrait, dramatic studio lighting, glossy finish, bold color blocking",
          negativePrompt: "casual clothing, dull lighting, bad anatomy",
          style: "Concept Art",
          size: "1024x1536",
        },
        recommendations: [
          "neon lighting with reflective floor and cinematic haze",
          "monochrome styling with spotlight and hard shadows",
          "architectural outdoor backdrop, wide lens dynamic pose",
        ],
        cheatSheet: [
          { title: "灯光", detail: "主灯 45° + 堵光描边，增强质感。" },
          { title: "适合用途", detail: "Campaign 海报、电商头图、社媒封面。" },
        ],
      },
    ],
  },
  {
    id: "music",
    label: "音乐工作室",
    description: "生成视频、播客、活动所需的定制配乐。",
    icon: Music4,
    templates: [
      {
        id: "ambient-love",
        name: "Ambient 浪漫主题",
        description: "柔和钢琴与垫底氛围，适合婚礼影片。",
        icon: Music4,
        tags: ["Ambient", "温暖", "电影感"],
        defaults: {
          prompt:
            "gentle ambient score for wedding film, shimmering pads, evolving piano motifs",
          mood: "romantic",
          genre: "ambient",
          duration: "60",
          tempo: "slow",
          instrumentation: ["piano", "strings", "synth"],
        },
        recommendations: [
          "warm piano arpeggios with airy pads",
          "strings slowly evolving with vocal hums",
          "minimal ambient texture blooming in climax",
        ],
        cheatSheet: [
          { title: "使用场景", detail: "婚礼剪辑、纪念日短片。" },
          { title: "情绪控制", detail: "设置缓慢上扬的情绪曲线。" },
        ],
      },
      {
        id: "cinematic-trailer",
        name: "Cinematic Trailer",
        description: "恢弘混合管弦，适合品牌发布预热。",
        icon: Clapperboard,
        tags: ["预告片", "震撼", "Hybrid"],
        defaults: {
          prompt:
            "epic cinematic trailer score with hybrid orchestral hits, dramatic build, triumphant finale",
          mood: "dramatic",
          genre: "orchestral",
          duration: "60",
          tempo: "fast",
          instrumentation: ["strings", "percussion", "synth"],
        },
        recommendations: [
          "bold brass stabs with heavy percussion",
          "hybrid pulses with aggressive risers",
          "slow-building intro erupting into climax",
        ],
        cheatSheet: [
          { title: "结构", detail: "Intro- Build - Drop - Outro 的四段式。" },
          { title: "声音设计", detail: "加入冲击声、上升音效提高张力。" },
        ],
      },
      {
        id: "lofi-daily",
        name: "Lo-Fi 日常陪伴",
        description: "轻松律动，适合直播、学习场景。",
        icon: Camera,
        tags: ["Lo-Fi", "Chill", "循环"],
        defaults: {
          prompt:
            "lofi chill beat with vinyl crackle, jazzy chords, laid back groove, cozy night city mood",
          mood: "dreamy",
          genre: "lofi",
          duration: "120",
          tempo: "medium",
          instrumentation: ["piano", "percussion", "guitar"],
        },
        recommendations: [
          "jazzy chords with mellow guitar and brushed drums",
          "lofi tape warmth with vinyl hiss",
          "late night rain ambience layered with soft keys",
        ],
        cheatSheet: [
          { title: "循环技巧", detail: "使用 8 小节循环，首尾相接无断点。" },
          { title: "使用场景", detail: "学习直播、咖啡馆背景音。" },
        ],
      },
    ],
  },
  {
    id: "video",
    label: "视频工作室",
    description: "生成婚礼、产品与旅行短片的剧本与镜头设定。",
    icon: Film,
    templates: [
      {
        id: "wedding-highlights",
        name: "婚礼高光剪影",
        description: "聚焦情绪细节与仪式氛围。",
        icon: Sparkles,
        tags: ["婚礼", "情感叙事", "柔焦"],
        defaults: {
          prompt:
            "wedding highlight film with slow motion, close-up emotions, sun-drenched ceremony, elegant color grading",
          style: "cinematic",
          duration: "20",
          ratio: "16:9",
          includeVoiceover: true,
          motionLevel: "steady",
        },
        recommendations: [
          "capture vows with close-up tears and warm tones",
          "sunset couple portrait with slow motion veil movement",
          "dance floor celebration with sparkler exit",
        ],
        cheatSheet: [
          { title: "叙事节奏", detail: "按 vows → 宴会 → 夜景串联。" },
          { title: "色彩", detail: "奶油白 + 金色点缀打造浪漫氛围。" },
        ],
      },
      {
        id: "product-loop",
        name: "产品循环广告",
        description: "打造适配社媒的无缝循环产品展示。",
        icon: Camera,
        tags: ["产品", "商业", "循环"],
        defaults: {
          prompt:
            "hero product loop showcasing premium skincare bottle, floating particles, studio lighting, seamless loop",
          style: "motion-graphics",
          duration: "15",
          ratio: "9:16",
          includeVoiceover: false,
          motionLevel: "dynamic",
        },
        recommendations: [
          "macro lens orbit with glossy reflections",
          "soft mist and particles revealing logotype",
          "kinetic typography with product benefits",
        ],
        cheatSheet: [
          { title: "循环技巧", detail: "首尾帧保持一致，利于自动循环。" },
          { title: "投放建议", detail: "适合抖音/小红书/Instagram Reels。" },
        ],
      },
      {
        id: "travel-story",
        name: "旅行故事短片",
        description: "结合航拍与人文镜头，生成轻旅行 Vlog。",
        icon: Wand2,
        tags: ["旅行", "Vlog", "航拍"],
        defaults: {
          prompt:
            "travel film through coastal city, drone establishing shots, handheld street scenes, vibrant grading, voiceover storytelling",
          style: "stylized",
          duration: "30",
          ratio: "2.35:1",
          includeVoiceover: true,
          motionLevel: "dynamic",
        },
        recommendations: [
          "drone sunrise establishing shot over coastline",
          "slow-motion food close-ups with natural sound design",
          "handheld crowd scenes with gentle camera shake",
        ],
        cheatSheet: [
          { title: "镜头节奏", detail: "建立 → 人物 → 细节交替出现。" },
          { title: "音频提示", detail: "加入环境声与旁白增强沉浸感。" },
        ],
      },
    ],
  },
];

const CreativeDashboard = () => {
  const { user } = useAppContext();

  const [activeCategoryId, setActiveCategoryId] =
    useState<MediaCategoryId>("image");
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    mediaCatalog[0]?.templates[0]?.id ?? "",
  );

  const [imageForm, setImageForm] = useState<ImageFormState>({
    prompt: mediaCatalog[0]?.templates[0]?.defaults?.prompt ?? "",
    negativePrompt:
      mediaCatalog[0]?.templates[0]?.defaults?.negativePrompt ?? "",
    style: mediaCatalog[0]?.templates[0]?.defaults?.style ?? "Cinematic",
    size: mediaCatalog[0]?.templates[0]?.defaults?.size ?? "1024x1024",
    baseImage: null,
    baseImagePreview: "",
  });

  const [musicForm, setMusicForm] = useState<MusicFormState>({
    prompt: mediaCatalog[1]?.templates[0]?.defaults?.prompt ?? "",
    mood: mediaCatalog[1]?.templates[0]?.defaults?.mood ?? moodOptions[0].value,
    genre:
      mediaCatalog[1]?.templates[0]?.defaults?.genre ?? genreOptions[0].value,
    duration:
      mediaCatalog[1]?.templates[0]?.defaults?.duration ??
      musicDurationOptions[1].value,
    tempo:
      mediaCatalog[1]?.templates[0]?.defaults?.tempo ?? tempoOptions[1].value,
    instrumentation: mediaCatalog[1]?.templates[0]?.defaults
      ?.instrumentation ?? ["piano", "strings"],
    referenceFile: null,
  });

  const [videoForm, setVideoForm] = useState<VideoFormState>({
    prompt: mediaCatalog[2]?.templates[0]?.defaults?.prompt ?? "",
    style:
      mediaCatalog[2]?.templates[0]?.defaults?.style ??
      videoStyleOptions[0].value,
    duration:
      mediaCatalog[2]?.templates[0]?.defaults?.duration ??
      videoDurationOptions[1].value,
    ratio:
      mediaCatalog[2]?.templates[0]?.defaults?.ratio ??
      videoRatioOptions[0].value,
    includeVoiceover:
      mediaCatalog[2]?.templates[0]?.defaults?.includeVoiceover ?? false,
    motionLevel:
      mediaCatalog[2]?.templates[0]?.defaults?.motionLevel ??
      motionOptions[1].value,
    referenceFile: null,
  });

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);
  const musicUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);

  const activeCategory = useMemo(
    () =>
      mediaCatalog.find((category) => category.id === activeCategoryId) ??
      mediaCatalog[0],
    [activeCategoryId],
  );
  const activeTemplate = useMemo(
    () =>
      activeCategory.templates.find(
        (template) => template.id === activeTemplateId,
      ) ?? activeCategory.templates[0],
    [activeCategory, activeTemplateId],
  );

  useEffect(() => {
    if (
      !activeCategory.templates.some(
        (template) => template.id === activeTemplateId,
      )
    ) {
      setActiveTemplateId(activeCategory.templates[0]?.id ?? "");
    }
  }, [activeCategory, activeTemplateId]);

  const applyTemplateDefaults = useCallback(
    (categoryId: MediaCategoryId, template: MediaTemplate) => {
      if (categoryId === "image") {
        setImageForm((prev) => ({
          ...prev,
          prompt: template.defaults?.prompt ?? prev.prompt,
          negativePrompt:
            template.defaults?.negativePrompt ?? prev.negativePrompt,
          style: template.defaults?.style ?? prev.style,
          size: template.defaults?.size ?? prev.size,
        }));
      }
      if (categoryId === "music") {
        setMusicForm((prev) => ({
          ...prev,
          prompt: template.defaults?.prompt ?? prev.prompt,
          mood: template.defaults?.mood ?? prev.mood,
          genre: template.defaults?.genre ?? prev.genre,
          duration: template.defaults?.duration ?? prev.duration,
          tempo: template.defaults?.tempo ?? prev.tempo,
          instrumentation:
            template.defaults?.instrumentation ?? prev.instrumentation,
        }));
      }
      if (categoryId === "video") {
        setVideoForm((prev) => ({
          ...prev,
          prompt: template.defaults?.prompt ?? prev.prompt,
          style: template.defaults?.style ?? prev.style,
          duration: template.defaults?.duration ?? prev.duration,
          ratio: template.defaults?.ratio ?? prev.ratio,
          includeVoiceover:
            template.defaults?.includeVoiceover ?? prev.includeVoiceover,
          motionLevel: template.defaults?.motionLevel ?? prev.motionLevel,
        }));
      }
    },
    [],
  );

  useEffect(() => {
    if (activeTemplate) {
      applyTemplateDefaults(activeCategoryId, activeTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  const handleTemplateSelect = (
    categoryId: MediaCategoryId,
    template: MediaTemplate,
  ) => {
    setActiveCategoryId(categoryId);
    setActiveTemplateId(template.id);
    applyTemplateDefaults(categoryId, template);
    toast.success(`已切换至「${template.name}」`, {
      description: template.description,
    });
  };

  const handleImageUpload = (file: File | null) => {
    setImageForm((prev) => {
      if (prev.baseImagePreview) {
        URL.revokeObjectURL(prev.baseImagePreview);
      }
      if (!file) {
        return { ...prev, baseImage: null, baseImagePreview: "" };
      }
      const preview = URL.createObjectURL(file);
      return { ...prev, baseImage: file, baseImagePreview: preview };
    });
  };

  const handleMusicReferenceUpload = (file: File | null) => {
    setMusicForm((prev) => ({ ...prev, referenceFile: file ?? null }));
  };

  const handleVideoReferenceUpload = (file: File | null) => {
    setVideoForm((prev) => ({ ...prev, referenceFile: file ?? null }));
  };

  const handleGenerateImage = async () => {
    if (!imageForm.prompt.trim()) {
      toast.error("请先填写提示词");
      return;
    }
    setIsGeneratingImage(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGeneratingImage(false);
    toast.success("图像任务已提交", {
      description: "系统将自动通知生成结果。",
    });
  };

  const handleGenerateMusic = async () => {
    if (!musicForm.prompt.trim()) {
      toast.error("请填写音乐描述");
      return;
    }
    setIsGeneratingMusic(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGeneratingMusic(false);
    toast.success("音乐生成已启动", { description: "音轨正在渲染，请稍候。" });
  };

  const handleGenerateVideo = async () => {
    if (!videoForm.prompt.trim()) {
      toast.error("请填写剧本或镜头描述");
      return;
    }
    setIsGeneratingVideo(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGeneratingVideo(false);
    toast.success("视频渲染已提交", {
      description: "场景故事版将在完成后推送。",
    });
  };

  const renderImageForm = () => (
    <form
      className="space-y-6"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        handleGenerateImage();
      }}
    >
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">提示词</h2>
          <p className="text-sm text-slate-500">描述你希望生成的画面与氛围。</p>
        </header>
        <div className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              正向提示词
            </label>
            <Textarea
              value={imageForm.prompt}
              onChange={(event) =>
                setImageForm((prev) => ({
                  ...prev,
                  prompt: event.target.value,
                }))
              }
              rows={4}
              placeholder="例如：cinematic portrait of a couple under cherry blossoms, golden hour light..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              反向提示词
            </label>
            <Textarea
              value={imageForm.negativePrompt}
              onChange={(event) =>
                setImageForm((prev) => ({
                  ...prev,
                  negativePrompt: event.target.value,
                }))
              }
              rows={3}
              placeholder="例如：blurry, distortion, duplicate face..."
            />
          </div>
          {activeTemplate?.recommendations?.length ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                推荐语句
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTemplate.recommendations.map((recommendation) => (
                  <button
                    type="button"
                    key={recommendation}
                    onClick={() =>
                      setImageForm((prev) => ({
                        ...prev,
                        prompt: recommendation,
                      }))
                    }
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    {recommendation}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">风格与垫图</h2>
          <p className="text-sm text-slate-500">
            选择画面风格、尺寸或上传垫图引导构图。
          </p>
        </header>
        <div className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">风格类型</span>
            <div className="flex flex-wrap gap-2">
              {imageStyleOptions.map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setImageForm((prev) => ({ ...prev, style }))}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    imageForm.style === style
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100",
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                图像尺寸
              </span>
              <Select
                value={imageForm.size}
                onValueChange={(value) =>
                  setImageForm((prev) => ({ ...prev, size: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择尺寸" />
                </SelectTrigger>
                <SelectContent>
                  {imageSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                参考图上传
              </span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => imageUploadRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> 上传垫图
                </Button>
                <span className="text-xs text-slate-500">
                  支持 JPG/PNG，建议 4MB 以内。
                </span>
                <input
                  ref={imageUploadRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    handleImageUpload(file);
                    event.target.value = "";
                  }}
                />
              </div>
              {imageForm.baseImagePreview ? (
                <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={imageForm.baseImagePreview}
                    alt="参考图预览"
                    className="h-40 w-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute right-3 top-3 h-7 w-7 rounded-full bg-white/80 backdrop-blur"
                    onClick={() => handleImageUpload(null)}
                  >
                    <Trash2 className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setImageForm((prev) => ({
              ...prev,
              prompt: "",
              negativePrompt: "",
            }))
          }
        >
          清空提示词
        </Button>
        <Button type="submit" disabled={isGeneratingImage}>
          {isGeneratingImage ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}{" "}
          生成图像
        </Button>
      </div>
    </form>
  );

  const renderMusicForm = () => (
    <form
      className="space-y-6"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        handleGenerateMusic();
      }}
    >
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">音乐描述</h2>
          <p className="text-sm text-slate-500">
            说明曲风、情绪、应用场景，AI 将生成对应配乐。
          </p>
        </header>
        <div className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              音乐提示词
            </label>
            <Textarea
              value={musicForm.prompt}
              onChange={(event) =>
                setMusicForm((prev) => ({
                  ...prev,
                  prompt: event.target.value,
                }))
              }
              rows={4}
              placeholder="例如：gentle piano with airy pads for a wedding highlight film..."
            />
          </div>
          {activeTemplate?.recommendations?.length ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                推荐语句
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTemplate.recommendations.map((recommendation) => (
                  <button
                    type="button"
                    key={recommendation}
                    onClick={() =>
                      setMusicForm((prev) => ({
                        ...prev,
                        prompt: recommendation,
                      }))
                    }
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    {recommendation}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">曲目设定</h2>
          <p className="text-sm text-slate-500">
            调整情绪、曲风、速度与编配细节。
          </p>
        </header>
        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">情绪</span>
              <Select
                value={musicForm.mood}
                onValueChange={(value) =>
                  setMusicForm((prev) => ({ ...prev, mood: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择情绪" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">曲风</span>
              <Select
                value={musicForm.genre}
                onValueChange={(value) =>
                  setMusicForm((prev) => ({ ...prev, genre: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择曲风" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">时长</span>
              <Select
                value={musicForm.duration}
                onValueChange={(value) =>
                  setMusicForm((prev) => ({ ...prev, duration: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择时长" />
                </SelectTrigger>
                <SelectContent>
                  {musicDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">速度</span>
              <Select
                value={musicForm.tempo}
                onValueChange={(value) =>
                  setMusicForm((prev) => ({ ...prev, tempo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择速度" />
                </SelectTrigger>
                <SelectContent>
                  {tempoOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                参考音频
              </span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => musicUploadRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> 上传
                </Button>
                <span className="text-xs text-slate-500">支持 MP3/WAV</span>
                <input
                  ref={musicUploadRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    handleMusicReferenceUpload(file);
                    event.target.value = "";
                  }}
                />
              </div>
              {musicForm.referenceFile ? (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="max-w-[12rem] truncate text-slate-600">
                    {musicForm.referenceFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMusicReferenceUpload(null)}
                  >
                    <Trash2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">乐器编配</span>
            <div className="flex flex-wrap gap-2">
              {instrumentOptions.map((option) => {
                const isActive = musicForm.instrumentation.includes(
                  option.value,
                );
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() =>
                      setMusicForm((prev) => {
                        const set = new Set(prev.instrumentation);
                        if (set.has(option.value)) {
                          set.delete(option.value);
                        } else {
                          set.add(option.value);
                        }
                        return { ...prev, instrumentation: Array.from(set) };
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleMusicReferenceUpload(null)}
        >
          清除参考
        </Button>
        <Button type="submit" disabled={isGeneratingMusic}>
          {isGeneratingMusic ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Music4 className="mr-2 h-4 w-4" />
          )}{" "}
          生成音乐
        </Button>
      </div>
    </form>
  );

  const renderVideoForm = () => (
    <form
      className="space-y-6"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        handleGenerateVideo();
      }}
    >
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">剧本与镜头</h2>
          <p className="text-sm text-slate-500">
            描述场景、情绪与镜头节奏，系统会生成故事版。
          </p>
        </header>
        <div className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              剧情描述
            </label>
            <Textarea
              value={videoForm.prompt}
              onChange={(event) =>
                setVideoForm((prev) => ({
                  ...prev,
                  prompt: event.target.value,
                }))
              }
              rows={6}
              placeholder="例如：sunset ceremony, guests applauding, slow motion vows, drone shot of venue..."
            />
          </div>
          {activeTemplate?.recommendations?.length ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                镜头灵感
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTemplate.recommendations.map((recommendation) => (
                  <button
                    type="button"
                    key={recommendation}
                    onClick={() =>
                      setVideoForm((prev) => ({
                        ...prev,
                        prompt: recommendation,
                      }))
                    }
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
                  >
                    {recommendation}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">画面设定</h2>
          <p className="text-sm text-slate-500">
            调整风格、时长、画幅以及配音需求。
          </p>
        </header>
        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">风格</span>
              <Select
                value={videoForm.style}
                onValueChange={(value) =>
                  setVideoForm((prev) => ({ ...prev, style: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择风格" />
                </SelectTrigger>
                <SelectContent>
                  {videoStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">时长</span>
              <Select
                value={videoForm.duration}
                onValueChange={(value) =>
                  setVideoForm((prev) => ({ ...prev, duration: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择时长" />
                </SelectTrigger>
                <SelectContent>
                  {videoDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                画幅比例
              </span>
              <Select
                value={videoForm.ratio}
                onValueChange={(value) =>
                  setVideoForm((prev) => ({ ...prev, ratio: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择画幅" />
                </SelectTrigger>
                <SelectContent>
                  {videoRatioOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                运镜节奏
              </span>
              <div className="flex flex-wrap gap-2">
                {motionOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() =>
                      setVideoForm((prev) => ({
                        ...prev,
                        motionLevel: option.value,
                      }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      videoForm.motionLevel === option.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                旁白 / 配音
              </span>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    自动生成旁白
                  </p>
                  <p className="text-xs text-slate-500">
                    由 AI 自动撰写文案并合成配音轨。
                  </p>
                </div>
                <Switch
                  checked={videoForm.includeVoiceover}
                  onCheckedChange={(checked) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      includeVoiceover: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">参考素材</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => videoUploadRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> 上传素材
              </Button>
              <span className="text-xs text-slate-500">
                支持 JPG/PNG/MP4，建议 10 秒内。
              </span>
              <input
                ref={videoUploadRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  handleVideoReferenceUpload(file);
                  event.target.value = "";
                }}
              />
            </div>
            {videoForm.referenceFile ? (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <span className="max-w-[12rem] truncate text-slate-600">
                  {videoForm.referenceFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleVideoReferenceUpload(null)}
                >
                  <Trash2 className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleVideoReferenceUpload(null)}
        >
          清除参考
        </Button>
        <Button type="submit" disabled={isGeneratingVideo}>
          {isGeneratingVideo ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Clapperboard className="mr-2 h-4 w-4" />
          )}{" "}
          生成视频
        </Button>
      </div>
    </form>
  );

  const TemplateIcon = activeTemplate?.icon;
  const CategoryIcon = activeCategory?.icon;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {CategoryIcon ? <CategoryIcon className="h-4 w-4" /> : null}
            <span>{activeCategory.label}</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {activeTemplate?.name}
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            {activeCategory.description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">当前账号</p>
            <p className="text-sm font-medium text-slate-800">
              {user?.nickname || user?.email || "访客"}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-600">
            <Sparkles className="h-4 w-4" /> Creative Studio
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="space-y-4">
          {mediaCatalog.map((category) => {
            const Icon = category.icon;
            const isActive = category.id === activeCategoryId;
            return (
              <div
                key={category.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => {
                    const firstTemplate = category.templates[0];
                    setActiveCategoryId(category.id);
                    setActiveTemplateId(firstTemplate?.id ?? "");
                    if (firstTemplate) {
                      applyTemplateDefaults(category.id, firstTemplate);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-t-2xl px-4 py-3 text-left",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{category.label}</p>
                    <p className="text-xs text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </button>

                {isActive ? (
                  <div className="space-y-1 px-3 pb-4 pt-3">
                    {category.templates.map((template) => {
                      const TemplateIconLocal = template.icon;
                      const isTemplateActive = template.id === activeTemplateId;
                      return (
                        <button
                          type="button"
                          key={template.id}
                          onClick={() =>
                            handleTemplateSelect(category.id, template)
                          }
                          className={cn(
                            "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                            isTemplateActive
                              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                              : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg",
                                isTemplateActive
                                  ? "bg-white/10 text-white"
                                  : "bg-slate-100 text-slate-600",
                              )}
                            >
                              <TemplateIconLocal className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-tight">
                                {template.name}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {template.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className={cn(
                                  "px-2 py-0.5 text-[10px]",
                                  isTemplateActive
                                    ? "bg-white/10 text-slate-100"
                                    : "bg-slate-100 text-slate-500",
                                )}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </aside>

        <section className="space-y-6">
          {activeCategoryId === "image" && renderImageForm()}
          {activeCategoryId === "music" && renderMusicForm()}
          {activeCategoryId === "video" && renderVideoForm()}
        </section>
      </div>

      <aside className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeTemplate?.cheatSheet?.map((tip) => (
          <div
            key={tip.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {tip.title}
            </p>
            <p className="mt-2 text-sm text-slate-600">{tip.detail}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-500 via-indigo-500 to-purple-600 p-6 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            工作流建议
          </p>
          <h3 className="mt-2 text-lg font-semibold">
            {activeCategoryId === "image"
              ? "提示词 → 垫图 → 风格"
              : activeCategoryId === "music"
                ? "情绪 → 曲风 → 编配"
                : "剧本 → 镜头 → 配音"}
          </h3>
          <p className="mt-2 text-sm text-white/80">
            按照模板推荐顺序填写，可快速得到更稳定的结果。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="bg-white/15 text-white hover:bg-white/20"
              onClick={() => {
                if (activeTemplate?.recommendations?.[0]) {
                  const suggestion = activeTemplate.recommendations[0];
                  if (activeCategoryId === "image") {
                    setImageForm((prev) => ({ ...prev, prompt: suggestion }));
                  } else if (activeCategoryId === "music") {
                    setMusicForm((prev) => ({ ...prev, prompt: suggestion }));
                  } else {
                    setVideoForm((prev) => ({ ...prev, prompt: suggestion }));
                  }
                  toast.info("已填入模板推荐描述");
                }
              }}
            >
              <Sparkles className="mr-1 h-4 w-4" /> 一键填入推荐
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-white text-indigo-600 hover:bg-white/90"
            >
              查看历史记录
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CreativeDashboard;
