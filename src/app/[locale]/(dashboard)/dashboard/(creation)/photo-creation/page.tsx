import PhotoCreationClient from "./PhotoCreationClient";
import { TemplateItem } from "@/types/blocks/templates";
import { getTemplatesPage } from "@/services/page";

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
    category: "effects",
    image_settings: {
      type: "text-to-image",
      required_prompt: true,
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
      required_reference_image_count: 2,
      prompt:
        "two adults (bride in classic white wedding dress, groom in tailored black tuxedo) standing in a clean white cyclorama studio, high-key lighting with large softbox and gentle fill, natural skin tones, elegant pose (embrace / holding hands), 85mm lens look, shallow depth of field, editorial minimalism, cinematic grading, award-winning wedding portrait, no heart shapes",
      type: "image-to-image",
    },
  },
  {
    slug: "neon-night-portrait",
    cover: "https://picsum.photos/300/300?random=3",
    type: "image",
    samples: [
      "https://picsum.photos/300/300?random=3",
      "https://picsum.photos/300/300?random=4",
      "https://picsum.photos/300/300?random=5",
    ],
    tags: ["Couples", "Anniversary", "Portrait", "Neon"],
    category: "effects",
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
    cover: "https://picsum.photos/300/300?random=4",
    type: "video",
    samples: [
      "https://picsum.photos/300/300?random=4",
      "https://picsum.photos/300/300?random=5",
      "https://picsum.photos/300/300?random=6",
    ],
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
      required_reference_image: true,
      required_prompt: true,
      prompt:
        "A romantic outdoor portrait of a couple at sunset, soft light, natural colors, scenic background",
      type: "text-to-image",
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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const templatesPage = await getTemplatesPage(locale);

  // 根据 templatesPage 回填 name、title、description
  const templates: TemplateItem[] = templatesConfig
    .filter((t) => t.type === "image")
    .map((template) => {
      // 查找对应的回填信息
      const fillItem = templatesPage?.items?.find(
        (item) => item.slug === template.slug,
      );
      return {
        ...template,
        name: fillItem?.name ?? template.name,
        title: fillItem?.title ?? template.title,
        description: fillItem?.description ?? template.description,
      };
    });

  return <PhotoCreationClient templates={templates} />;
}
