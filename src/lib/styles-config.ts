import {
  Heart,
  Baby,
  Users,
  User,
  Palette,
  ImageIcon,
  Music4,
  Film,
} from "lucide-react";

export interface StyleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  credits: number;
  time: string;
  rating: number;
  tags: string[];
  tagColor: string;
  contentTypes: ("image" | "audio" | "video")[];
}

export interface StyleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  styles: StyleItem[];
}

export const stylesConfig: StyleCategory[] = [
  {
    id: "couples",
    name: "Couples",
    slug: "couples-photography",
    description:
      "Create beautiful couple photos with AI-powered effects and filters",
    icon: Heart,
    color: "text-pink-500",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-500",
    styles: [
      {
        id: "romantic-portrait",
        title: "Romantic Portrait",
        description:
          "Intimate couple portraits with soft lighting and warm tones",
        image: "/imgs/placeholder.png",
        credits: 5,
        time: "30s",
        rating: 4.8,
        tags: ["POPULAR", "Portrait"],
        tagColor: "bg-orange-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "vintage-couple",
        title: "Vintage Couple",
        description: "Classic vintage style with nostalgic atmosphere",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "45s",
        rating: 4.7,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "sunset-romance",
        title: "Sunset Romance",
        description: "Golden hour couple photos with dreamy backgrounds",
        image: "/imgs/placeholder.png",
        credits: 6,
        time: "40s",
        rating: 4.9,
        tags: ["FREE"],
        tagColor: "bg-green-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "couples-audio",
        title: "Love Story Audio",
        description: "Romantic background music for couple moments",
        image: "/imgs/placeholder.png",
        credits: 3,
        time: "60s",
        rating: 4.6,
        tags: ["Audio"],
        tagColor: "bg-blue-500",
        contentTypes: ["audio"],
      },
    ],
  },
  {
    id: "babies",
    name: "Babies",
    slug: "baby-photography",
    description:
      "Capture precious baby moments with AI-powered effects and filters",
    icon: Baby,
    color: "text-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    styles: [
      {
        id: "cute-baby-portrait",
        title: "Cute Baby Portrait",
        description: "Adorable baby photos with soft, natural lighting",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "25s",
        rating: 4.9,
        tags: ["POPULAR", "Portrait"],
        tagColor: "bg-orange-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "fairy-tale-baby",
        title: "Fairy Tale Baby",
        description: "Magical baby photos with dreamy, whimsical effects",
        image: "/imgs/placeholder.png",
        credits: 5,
        time: "40s",
        rating: 4.8,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "baby-lullaby",
        title: "Baby Lullaby",
        description: "Gentle lullaby music for baby moments",
        image: "/imgs/placeholder.png",
        credits: 2,
        time: "45s",
        rating: 4.7,
        tags: ["Audio"],
        tagColor: "bg-blue-500",
        contentTypes: ["audio"],
      },
      {
        id: "watercolor-baby",
        title: "Watercolor Baby",
        description: "Soft watercolor painting effect for baby photos",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "50s",
        rating: 4.6,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image"],
      },
    ],
  },
  {
    id: "families",
    name: "Families",
    slug: "family-photography",
    description:
      "Create beautiful family memories with AI-powered effects and filters",
    icon: Users,
    color: "text-green-500",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    styles: [
      {
        id: "family-portrait",
        title: "Family Portrait",
        description: "Classic family photos with warm, natural lighting",
        image: "/imgs/placeholder.png",
        credits: 6,
        time: "45s",
        rating: 4.8,
        tags: ["POPULAR", "Portrait"],
        tagColor: "bg-orange-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "outdoor-family",
        title: "Outdoor Family",
        description:
          "Natural outdoor family photography with beautiful backgrounds",
        image: "/imgs/placeholder.png",
        credits: 5,
        time: "40s",
        rating: 4.7,
        tags: ["FREE"],
        tagColor: "bg-green-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "family-memories",
        title: "Family Memories",
        description: "Heartwarming background music for family moments",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "50s",
        rating: 4.6,
        tags: ["Audio"],
        tagColor: "bg-blue-500",
        contentTypes: ["audio"],
      },
      {
        id: "holiday-family",
        title: "Holiday Family",
        description: "Festive family photos with seasonal themes",
        image: "/imgs/placeholder.png",
        credits: 7,
        time: "55s",
        rating: 4.9,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
    ],
  },
  {
    id: "portraits",
    name: "Portraits",
    slug: "portrait-photography",
    description:
      "Create stunning individual portraits with AI-powered effects and filters",
    icon: User,
    color: "text-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-indigo-500",
    styles: [
      {
        id: "realistic-portrait",
        title: "Realistic Portrait",
        description:
          "Professional headshots and portraits with natural lighting",
        image: "/imgs/placeholder.png",
        credits: 5,
        time: "30s",
        rating: 4.8,
        tags: ["POPULAR", "Portrait"],
        tagColor: "bg-orange-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "artistic-portrait",
        title: "Artistic Portrait",
        description: "Creative artistic portraits with unique lighting effects",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "45s",
        rating: 4.7,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "portrait-voice",
        title: "Portrait Voice",
        description: "Professional voice enhancement for portrait videos",
        image: "/imgs/placeholder.png",
        credits: 3,
        time: "35s",
        rating: 4.5,
        tags: ["Audio"],
        tagColor: "bg-blue-500",
        contentTypes: ["audio"],
      },
      {
        id: "dramatic-portrait",
        title: "Dramatic Portrait",
        description: "Bold, dramatic portraits with striking contrasts",
        image: "/imgs/placeholder.png",
        credits: 6,
        time: "40s",
        rating: 4.9,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
    ],
  },
  {
    id: "art-styles",
    name: "Art Styles",
    slug: "artistic-effects",
    description:
      "Transform your photos into beautiful artwork with AI-powered artistic effects",
    icon: Palette,
    color: "text-indigo-500",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-500",
    styles: [
      {
        id: "anime-style",
        title: "Anime Style",
        description: "Transform photos into Japanese anime artwork",
        image: "/imgs/placeholder.png",
        credits: 3,
        time: "45s",
        rating: 4.8,
        tags: ["FREE", "Art Style"],
        tagColor: "bg-green-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "oil-painting",
        title: "Oil Painting",
        description: "Classical oil painting effects with rich textures",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "60s",
        rating: 4.8,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
      {
        id: "artistic-music",
        title: "Artistic Music",
        description: "Creative background music for artistic content",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "55s",
        rating: 4.6,
        tags: ["Audio"],
        tagColor: "bg-blue-500",
        contentTypes: ["audio"],
      },
      {
        id: "watercolor",
        title: "Watercolor",
        description: "Soft watercolor painting with flowing colors",
        image: "/imgs/placeholder.png",
        credits: 4,
        time: "50s",
        rating: 4.8,
        tags: ["Art Style"],
        tagColor: "bg-gray-500",
        contentTypes: ["image", "video"],
      },
    ],
  },
];

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): StyleCategory | undefined => {
  return stylesConfig.find((category) => category.slug === slug);
};

// Helper function to get category by id
export const getCategoryById = (id: string): StyleCategory | undefined => {
  return stylesConfig.find((category) => category.id === id);
};

// Helper function to get all category slugs for routing
export const getAllCategorySlugs = (): string[] => {
  return stylesConfig.map((category) => category.slug);
};
