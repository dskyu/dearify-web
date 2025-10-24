export interface TemplateImageSettings {
  required_reference_image_count?: number;
  required_reference_image?: boolean;
  required_prompt?: boolean;
  type: "text-to-image" | "image-to-image";
  prompt?: string;
}

export interface TemplateAudioSettings {
  prompt?: string;
  voice_type?: string;
  no_human_voice?: boolean;
}

export interface TemplateVideoSettings {
  prompt?: string;
  duration?: number;
  reference_image?: string;
  aspect_ratio?: "landscape" | "portrait";
}

export interface TemplateItem {
  slug: string;
  name?: string;
  title?: string;
  description?: string;
  instructions?: string;
  cover: string;
  type: "image" | "audio" | "video";
  samples: string[];
  compare?: boolean;
  tags: string[];
  image_settings?: TemplateImageSettings;
  audio_settings?: TemplateAudioSettings;
  video_settings?: TemplateVideoSettings;
}
