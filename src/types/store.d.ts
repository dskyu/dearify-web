// App developer information interface
export interface AppDeveloper {
  id: string;
  name: string;
  avatar: string;
  website: string;
  email: string;
}

// App information interface
export interface AppInfo {
  channel: AppChannel;
  app_id: string;
  bundle_id: string;
  name: string;
  category_name: string;
  category_id: string;
  icon: string;
  title: string;
  summary: string;
  description: string;
  screenshots: string[];
  content_rating: string;
  score: string;
  rating: number;
  histogram: Record<number, number>;
  downloads: string;
  size: number;
  version: string;
  updated_at: string;
  release_date: string;
  header_image: string;
  is_free: boolean;
  reviews: number;
  price: string;
  currency: string;
  os_required: string;
  developer: AppDeveloper;
  store_url: string;
}

// App review interface
export interface AppReview {
  id: string;
  username: string;
  userAvatar: string;
  version: string;
  rating: number;
  title: string;
  content: string;
  url: string;
  updated: string;
}

export type AppChannel = "apple" | "google";

export type AppleAppCategory =
  | 0 // All
  | 6018 // Books
  | 6000 // Business
  | 6026 // Developer Tools
  | 6017 // Education
  | 6016 // Entertainment
  | 6015 // Finance
  | 6023 // Food and Drink
  | 6014 // Games
  | 6027 // Graphics and Design
  | 6013 // Health and Fitness
  | 6012 // Lifestyle
  | 6021 // Magazines and Newspapers
  | 6020 // Medical
  | 6011 // Music
  | 6010 // Navigation
  | 6009 // News
  | 6008 // Photo and Video
  | 6007 // Productivity
  | 6006 // Reference
  | 6005 // Social Networking
  | 6024 // Shopping
  | 6004 // Sports
  | 6003 // Travel
  | 6002 // Utilities
  | 6001 // Weather
  | 7001 // Game Action
  | 7002 // Game Adventure
  | 7003 // Game Casual
  | 7004 // Game Board
  | 7005 // Game Card
  | 7006 // Game Casino
  | 7009 // Game Family
  | 7011 // Game Music
  | 7012 // Game Puzzle
  | 7013 // Game Racing
  | 7007 // Game Role Playing
  | 7015 // Game Simulation
  | 7016 // Game Sports
  | 7017 // Game Strategy
  | 7018 // Game Trivia
  | 7019; // Game Word

export type AppleAppCollection =
  | "topmacapps"
  | "topfreemacapps"
  | "topgrossingmacapps"
  | "toppaidmacapps"
  | "newapplications"
  | "newfreeapplications"
  | "newpaidapplications"
  | "topfreeapplications"
  | "topfreeipadapplications"
  | "topgrossingapplications"
  | "topgrossingipadapplications"
  | "toppaidapplications"
  | "toppaidipadapplications";

export type AppleAppDeviceType = "iPadSoftware" | "macSoftware" | "software";

export type AppleAppSortType = "mostRecent" | "mostHelpful";

export type GoogleAppCategory =
  | "" // All
  | "ANDROID_WEAR" // Android Wear
  | "APPLICATION" // Application
  | "ART_AND_DESIGN" // Art and Design
  | "AUTO_AND_VEHICLES" // Auto and Vehicles
  | "BEAUTY" // Beauty
  | "BOOKS_AND_REFERENCE" // Books and Reference
  | "BUSINESS" // Business
  | "COMICS" // Comics
  | "COMMUNICATION" // Communication
  | "DATING" // Dating
  | "EDUCATION" // Education
  | "ENTERTAINMENT" // Entertainment
  | "EVENTS" // Events
  | "FINANCE" // Finance
  | "FOOD_AND_DRINK" // Food and Drink
  | "HEALTH_AND_FITNESS" // Health and Fitness
  | "HOUSE_AND_HOME" // House and Home
  | "LIFESTYLE" // Lifestyle
  | "MAPS_AND_NAVIGATION" // Maps and Navigation
  | "MEDICAL" // Medical
  | "MUSIC_AND_AUDIO" // Music and Audio
  | "NEWS_AND_MAGAZINES" // News and Magazines
  | "PARENTING" // Parenting
  | "PERSONALIZATION" // Personalization
  | "PHOTOGRAPHY" // Photography
  | "PRODUCTIVITY" // Productivity
  | "SHOPPING" // Shopping
  | "SOCIAL" // Social
  | "SPORTS" // Sports
  | "TOOLS" // Tools
  | "TRAVEL_AND_LOCAL" // Travel and Local
  | "VIDEO_PLAYERS" // Video Players
  | "WEATHER" // Weather
  | "GAME" // Game
  | "FAMILY" // Family
  | "GAME_ACTION" // Game Action
  | "GAME_ADVENTURE" // Game Adventure
  | "GAME_ARCADE" // Game Arcade
  | "GAME_BOARD" // Game Board
  | "GAME_CARD" // Game Card
  | "GAME_CASINO" // Game Casino
  | "GAME_CASUAL" // Game Casual
  | "GAME_EDUCATIONAL" // Game Educational
  | "GAME_MUSIC" // Game Music
  | "GAME_PUZZLE" // Game Puzzle
  | "GAME_RACING" // Game Racing
  | "GAME_ROLE_PLAYING" // Game Role Playing
  | "GAME_SIMULATION" // Game Simulation
  | "GAME_SPORTS" // Game Sports
  | "GAME_STRATEGY" // Game Strategy
  | "GAME_TRIVIA" // Game Trivia
  | "GAME_WORD" // Game Word
  | "FAMILY_ACTION" // Family Action
  | "FAMILY_BRAINGAMES" // Family Brain Games
  | "FAMILY_CREATE" // Family Creativity
  | "FAMILY_EDUCATION" // Family Education
  | "FAMILY_MUSICVIDEO" // Family Music and Video
  | "FAMILY_PRETEND"; // Family Pretend Play

export type GoogleAppCollection = "TOP_FREE" | "TOP_PAID" | "GROSSING";

export type GoogleAppSort = 1 | 2 | 3; // Helpfulness | Newest | Rating

export type GoogleAppAge = "AGE_RANGE1" | "AGE_RANGE2" | "AGE_RANGE3"; // Five Under | Six Eight | Nine Up

export type GoogleAppPermission = 0 | 1; // Common | Other
