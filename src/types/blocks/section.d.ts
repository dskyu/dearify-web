import { Image, Button } from "@/types/blocks/base";

export interface SectionItem {
  title?: string;
  description?: string;
  label?: string;
  icon?: string;
  image?: Image;
  buttons?: Button[];
  url?: string;
  target?: string;
  children?: SectionItem[];

  ///
  tips?: string;
  username?: string;
  time?: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  verified?: boolean;
  mediaType?: "image" | "music" | "video";
  category?: "wedding" | "family" | "travel" | "anniversary";
}

export interface Section {
  disabled?: boolean;
  name?: string;
  title?: string;
  description?: string;
  label?: string;
  icon?: string;
  image?: Image;
  buttons?: Button[];
  items?: SectionItem[];
}
