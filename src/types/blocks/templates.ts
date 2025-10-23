export interface TemplateImageSettings {
  required_reference_image_count?: number;
  required_reference_image?: boolean;
  required_prompt?: boolean;
  type: "text-to-image" | "image-to-image";
  prompt?: string;
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
  name?: string;
  title?: string;
  description?: string;
  cover: string;
  type: "image" | "audio" | "video";
  samples: string[];
  compare?: boolean;
  tags: string[];
  category: "effects" | "editing" | "portraits";
  image_settings?: TemplateImageSettings;
  audio_settings?: TemplateAudioSettings;
  video_settings?: TemplateVideoSettings;
}
