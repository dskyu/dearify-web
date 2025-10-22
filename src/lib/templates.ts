export interface TemplateImageSettings {
  reference_image_limit: number;
  prompt: string;
  type: "text-to-image" | "image-to-image";
  resolution: string;
  aspect_ratio: string;
}

export interface TemplateAudioSettings {
  lyrics: string;
  reference_file: string;
  vocal: string;
}

export interface TemplateVideoSettings {
  first_frame?: string;
  last_frame?: string;
  prompt: string;
  type: "text-to-video" | "image-to-video";
  sound_effects?: string[];
  duration?: number;
  resolution: string;
  aspect_ratio: string;
}

export interface TemplateItem {
  slug: string;
  cover: string;
  type: "image" | "audio" | "video";
  samples: string[];
  tags: string[];
  category: "effects" | "editing" | "portraits";
  image_settings?: TemplateImageSettings;
  audio_settings?: TemplateAudioSettings;
  video_settings?: TemplateVideoSettings;
}

export const templatesConfig: TemplateItem[] = [
  {
    slug: "free-style",
    cover: "https://picsum.photos/300/300?random=0",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=0"],
    tags: [],
    category: "effects",
    image_settings: {
      reference_image_limit: 1,
      prompt: "A realistic portrait of a couple",
      type: "text-to-image",
      resolution: "1024x1024",
      aspect_ratio: "1:1",
    },
  },
  {
    slug: "wedding-studio-classic-white",
    cover: "https://picsum.photos/300/300?random=1",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=1"],
    tags: ["Couples", "Wedding", "Portrait"],
    category: "effects",
    image_settings: {
      reference_image_limit: 1,
      prompt: "A studio wedding portrait of a couple",
      type: "text-to-image",
      resolution: "1024x1024",
      aspect_ratio: "1:1",
    },
  },
  {
    slug: "neon-night-portrait",
    cover: "https://picsum.photos/300/300?random=3",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=3"],
    tags: ["Couples", "Anniversary", "Portrait", "Neon"],
    category: "effects",
    image_settings: {
      reference_image_limit: 1,
      prompt:
        "A neon city night portrait of a couple, vibrant colors, modern style, enhanced skin, soft focus",
      type: "text-to-image",
      resolution: "2048x2048",
      aspect_ratio: "1:1",
    },
  },
  {
    slug: "our-year-recap-90s",
    cover: "https://picsum.photos/300/300?random=4",
    type: "video",
    samples: ["https://picsum.photos/300/300?random=4"],
    tags: ["Couples", "Recap", "Anniversary", "Film"],
    category: "effects",
    video_settings: {
      type: "image-to-video",
      prompt: "A proposal video of a couple",
      sound_effects: [],
      duration: 90,
      resolution: "1920x1080",
      aspect_ratio: "16:9",
    },
  },
  {
    slug: "proposal-reel-60-90s",
    cover: "https://picsum.photos/300/300?random=5",
    type: "video",
    samples: ["https://picsum.photos/300/300?random=5"],
    tags: ["Proposal", "Reel", "Wedding", "Video"],
    category: "effects",
    video_settings: {
      type: "image-to-video",
      prompt: "A proposal video of a couple",
      sound_effects: [],
      duration: 90,
      resolution: "1080x1920",
      aspect_ratio: "9:16",
    },
  },
  {
    slug: "anniversary-piano-theme",
    cover: "https://picsum.photos/300/300?random=6",
    type: "audio",
    samples: ["https://picsum.photos/300/300?random=6"],
    tags: ["Anniversary", "Music", "Theme Song"],
    category: "effects",
    audio_settings: {
      lyrics: "A custom anniversary piano theme song, warm and emotive",
      reference_file: "",
      vocal: "",
    },
  },
  {
    slug: "romantic-outdoor-sunset",
    cover: "https://picsum.photos/300/300?random=7",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=7"],
    tags: ["Couples", "Outdoor", "Sunset", "Portrait"],
    category: "portraits",
    image_settings: {
      reference_image_limit: 1,
      prompt:
        "A romantic outdoor portrait of a couple at sunset, soft light, natural colors, scenic background",
      type: "text-to-image",
      resolution: "2048x2048",
      aspect_ratio: "4:5",
    },
  },

  {
    slug: "first-dance-folk",
    cover: "https://picsum.photos/300/300?random=2",
    type: "audio",
    samples: ["https://picsum.photos/300/300?random=2"],
    tags: ["Couples", "Wedding", "Music"],
    category: "effects",
    audio_settings: {
      lyrics: "A studio wedding portrait of a couple",
      reference_file: "https://picsum.photos/300/300?random=2",
      vocal: "https://picsum.photos/300/300?random=2",
    },
  },
];
