import { TemplateItem } from "@/types/blocks/templates";

export const templatesConfig: TemplateItem[] = [
  {
    slug: "free-style",
    cover: "https://picsum.photos/300/300?random=0",
    type: "image",
    samples: [
      "https://picsum.photos/300/300?random=0 ",
      "https://picsum.photos/300/300?random=1",
      "https://picsum.photos/300/300?random=2",
    ],
    compare: true,
    tags: [],
    image_settings: {
      type: "text-to-image",
      required_prompt: true,
    },
  },
  {
    slug: "wedding-studio-classic-white",
    title: "Wedding Studio Classic White",
    description: "Elegant wedding portraits with professional studio lighting",
    cover: "https://picsum.photos/300/300?random=1",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=1"],
    tags: ["Couples", "Wedding", "Portrait", "AI Filters"],
    image_settings: {
      required_reference_image_count: 2,
      prompt:
        "two adults (bride in classic white wedding dress, groom in tailored black tuxedo) standing in a clean white cyclorama studio, high-key lighting with large softbox and gentle fill, natural skin tones, elegant pose (embrace / holding hands), 85mm lens look, shallow depth of field, editorial minimalism, cinematic grading, award-winning wedding portrait, no heart shapes",
      type: "image-to-image",
    },
  },
  {
    slug: "neon-night-portrait",
    title: "Neon Night Portrait",
    description: "Vibrant neon city portraits with modern artistic style",
    cover: "https://picsum.photos/300/300?random=3",
    type: "image",
    samples: [
      "https://picsum.photos/300/300?random=3",
      "https://picsum.photos/300/300?random=4",
      "https://picsum.photos/300/300?random=5",
    ],
    tags: ["Couples", "Portrait"],
    image_settings: {
      required_reference_image: true,
      prompt:
        "A neon city night portrait of a couple, vibrant colors, modern style, enhanced skin, soft focus",
      type: "text-to-image",
      required_prompt: true,
    },
  },
  {
    slug: "our-year-recap-90s",
    title: "Our Year Recap 90s",
    description: "Nostalgic 90s style year recap video with retro vibes",
    cover: "https://picsum.photos/300/300?random=4",
    type: "video",
    samples: [
      "https://picsum.photos/300/300?random=4",
      "https://picsum.photos/300/300?random=5",
      "https://picsum.photos/300/300?random=6",
    ],
    tags: ["Couples", "Babies", "Families"],
    video_settings: {
      prompt: "A proposal video of a couple",
      duration: 90,
      aspect_ratio: "landscape",
    },
  },
  {
    slug: "proposal-reel-60-90s",
    title: "Proposal Reel 60-90s",
    description: "Romantic proposal video with vintage 60s-90s aesthetic",
    cover: "https://picsum.photos/300/300?random=5",
    type: "video",
    samples: ["https://picsum.photos/300/300?random=5"],
    tags: ["Wedding"],
    video_settings: {
      prompt: "A proposal video of a couple",
      duration: 4,
      aspect_ratio: "portrait",
    },
  },
  {
    slug: "anniversary-piano-theme",
    title: "Anniversary Piano Theme",
    description: "Warm and emotive piano music for anniversary celebrations",
    cover: "https://picsum.photos/300/300?random=6",
    type: "audio",
    samples: ["https://picsum.photos/300/300?random=6"],
    tags: ["Couples"],
    audio_settings: {
      prompt: "A custom anniversary piano theme song, warm and emotive",
      voice_type: "ambient",
    },
  },
  {
    slug: "romantic-outdoor-sunset",
    title: "Romantic Outdoor Sunset",
    description: "Beautiful sunset portraits with natural golden hour lighting",
    cover: "https://picsum.photos/300/300?random=7",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=7"],
    tags: ["Couples", "Portrait"],
    image_settings: {
      required_reference_image: true,
      required_prompt: true,
      prompt:
        "A romantic outdoor portrait of a couple at sunset, soft light, natural colors, scenic background",
      type: "text-to-image",
    },
  },
  {
    slug: "professional-headshot",
    title: "Professional Headshot",
    description: "Clean, professional headshots with studio lighting",
    cover: "https://picsum.photos/300/300?random=8",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=8"],
    tags: ["Portrait", "Professional"],
    image_settings: {
      required_reference_image: true,
      prompt:
        "Professional headshot with clean studio lighting, natural skin tones",
      type: "image-to-image",
    },
  },
  {
    slug: "artistic-portrait",
    title: "Artistic Portrait",
    description: "Creative artistic portraits with unique lighting effects",
    cover: "https://picsum.photos/300/300?random=9",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=9"],
    tags: ["Portrait", "Art Style"],
    image_settings: {
      required_reference_image: true,
      required_prompt: true,
      prompt:
        "Artistic portrait with dramatic lighting and creative composition",
      type: "text-to-image",
    },
  },
  {
    slug: "color-correction",
    title: "Color Correction",
    description: "Professional color grading and correction tools",
    cover: "https://picsum.photos/300/300?random=10",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=10"],
    tags: ["Editing", "Color"],
    image_settings: {
      required_reference_image: true,
      type: "image-to-image",
    },
  },
  {
    slug: "background-removal",
    title: "Background Removal",
    description: "AI-powered background removal and replacement",
    cover: "https://picsum.photos/300/300?random=11",
    type: "image",
    samples: ["https://picsum.photos/300/300?random=11"],
    tags: ["Editing", "Background"],
    image_settings: {
      required_reference_image: true,
      type: "image-to-image",
    },
  },
  {
    slug: "first-dance-folk",
    title: "First Dance Folk",
    description: "Folk-style music perfect for wedding first dance moments",
    cover: "https://picsum.photos/300/300?random=2",
    type: "audio",
    samples: ["https://picsum.photos/300/300?random=2"],
    tags: ["Couples", "Wedding"],
    audio_settings: {
      prompt: "A studio wedding portrait of a couple",
      voice_type: "ambient",
      no_human_voice: true,
    },
  },
];

// Helper function to get templates by tag
export const getTemplatesByTag = (tagName: string): TemplateItem[] => {
  // Convert tagName to lowercase for case-insensitive matching
  const normalizedTagName = tagName.toLowerCase().trim();

  return templatesConfig.filter((template) => {
    return template.tags.some(
      (tag) =>
        tag.toLowerCase() === normalizedTagName ||
        tag.toLowerCase().replace(/\s+/g, "-") === normalizedTagName ||
        tag.toLowerCase().replace(/-/g, " ") === normalizedTagName,
    );
  });
};

// Helper function to convert tag to slug format
export const tagToSlug = (tag: string): string => {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Helper function to convert slug back to original tag (first match)
export const slugToTag = (slug: string): string => {
  // 直接通过字符转换将 slug 转回 tag，假设 slug 就是 slugified tag
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// Method to get all template slugs converted from tags
export const getAllTemplateSlugsFromTags = (): string[] => {
  const allTags = new Set<string>();

  // Collect all unique tags from all templates
  templatesConfig.forEach((template) => {
    template.tags.forEach((tag) => {
      allTags.add(tag);
    });
  });

  // Convert all tags to slug format and return as array
  return Array.from(allTags).map(tagToSlug);
};
