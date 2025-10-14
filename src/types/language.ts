export type StoreType = "apple" | "google";

// Country and Language Code Types
export type CountryCode =
  // Asia
  | "CN"
  | "JP"
  | "IN"
  | "KR"
  | "SG"
  | "TW"
  | "TH"
  | "MY"
  | "ID"
  | "PH"
  | "VN"
  | "HK"
  | "SA"
  | "AE"
  | "TR"
  | "IL"
  // Europe
  | "DE"
  | "GB"
  | "FR"
  | "IT"
  | "RU"
  | "ES"
  | "NL"
  | "CH"
  | "SE"
  | "PL"
  | "NO"
  | "DK"
  | "FI"
  // North America
  | "US"
  | "CA"
  | "MX"
  // South America
  | "BR"
  | "AR"
  | "CO"
  | "CL"
  | "PE"
  // Africa
  | "ZA"
  | "EG"
  | "NG"
  | "KE"
  // Oceania
  | "AU"
  | "NZ";

export type LanguageCode =
  | "ZH"
  | "JA"
  | "EN"
  | "HI"
  | "KO"
  | "MS"
  | "TL"
  | "TW"
  | "TH"
  | "ID"
  | "VI"
  | "AR"
  | "TR"
  | "HE"
  | "DE"
  | "FR"
  | "IT"
  | "RU"
  | "ES"
  | "NL"
  | "SV"
  | "PL"
  | "NO"
  | "DA"
  | "FI"
  | "PT"
  | "AF"
  | "SW"
  | "MI";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "ZH", name: "Chinese", nativeName: "中文" },
  { code: "JA", name: "Japanese", nativeName: "日本語" },
  { code: "EN", name: "English", nativeName: "English" },
  { code: "HI", name: "Hindi", nativeName: "हिन्दी" },
  { code: "KO", name: "Korean", nativeName: "한국어" },
  { code: "MS", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "TL", name: "Filipino", nativeName: "Filipino" },
  { code: "TW", name: "Traditional Chinese", nativeName: "繁體中文" },
  { code: "TH", name: "Thai", nativeName: "ไทย" },
  { code: "ID", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "VI", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "AR", name: "Arabic", nativeName: "العربية" },
  { code: "TR", name: "Turkish", nativeName: "Türkçe" },
  { code: "HE", name: "Hebrew", nativeName: "עברית" },
  { code: "DE", name: "German", nativeName: "Deutsch" },
  { code: "FR", name: "French", nativeName: "Français" },
  { code: "IT", name: "Italian", nativeName: "Italiano" },
  { code: "RU", name: "Russian", nativeName: "Русский" },
  { code: "ES", name: "Spanish", nativeName: "Español" },
  { code: "NL", name: "Dutch", nativeName: "Nederlands" },
  { code: "SV", name: "Swedish", nativeName: "Svenska" },
  { code: "PL", name: "Polish", nativeName: "Polski" },
  { code: "NO", name: "Norwegian", nativeName: "Norsk" },
  { code: "DA", name: "Danish", nativeName: "Dansk" },
  { code: "FI", name: "Finnish", nativeName: "Suomi" },
  { code: "PT", name: "Portuguese", nativeName: "Português" },
  { code: "AF", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "SW", name: "Swahili", nativeName: "Kiswahili" },
  { code: "MI", name: "Māori", nativeName: "Te Reo Māori" },
] as const;

export interface Country {
  code: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  language: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina", nativeName: "Argentina", flag: "🇦🇷", language: "es" },
  { code: "AU", name: "Australia", nativeName: "Australia", flag: "🇦🇺", language: "en" },
  { code: "BR", name: "Brazil", nativeName: "Brasil", flag: "🇧🇷", language: "pt" },
  { code: "CA", name: "Canada", nativeName: "Canada", flag: "🇨🇦", language: "en" },
  { code: "CL", name: "Chile", nativeName: "Chile", flag: "🇨🇱", language: "es" },
  { code: "CN", name: "China", nativeName: "中国", flag: "🇨🇳", language: "zh" },
  { code: "CO", name: "Colombia", nativeName: "Colombia", flag: "🇨🇴", language: "es" },
  { code: "DK", name: "Denmark", nativeName: "Danmark", flag: "🇩🇰", language: "da" },
  { code: "EG", name: "Egypt", nativeName: "مصر", flag: "🇪🇬", language: "ar" },
  { code: "FI", name: "Finland", nativeName: "Suomi", flag: "🇫🇮", language: "fi" },
  { code: "FR", name: "France", nativeName: "France", flag: "🇫🇷", language: "fr" },
  { code: "DE", name: "Germany", nativeName: "Deutschland", flag: "🇩🇪", language: "de" },
  { code: "HK", name: "Hong Kong", nativeName: "香港", flag: "🇭🇰", language: "zh" },
  { code: "IL", name: "Israel", nativeName: "ישראל", flag: "🇮🇱", language: "he" },
  { code: "IN", name: "India", nativeName: "भारत", flag: "🇮🇳", language: "en" },
  { code: "ID", name: "Indonesia", nativeName: "Indonesia", flag: "🇮🇩", language: "id" },
  { code: "IT", name: "Italy", nativeName: "Italia", flag: "🇮🇹", language: "it" },
  { code: "JP", name: "Japan", nativeName: "日本", flag: "🇯🇵", language: "ja" },
  { code: "KE", name: "Kenya", nativeName: "Kenya", flag: "🇰🇪", language: "en" },
  { code: "KR", name: "South Korea", nativeName: "대한민국", flag: "🇰🇷", language: "ko" },
  { code: "MY", name: "Malaysia", nativeName: "Malaysia", flag: "🇲🇾", language: "ms" },
  { code: "MX", name: "Mexico", nativeName: "México", flag: "🇲🇽", language: "es" },
  { code: "NL", name: "Netherlands", nativeName: "Nederland", flag: "🇳🇱", language: "nl" },
  { code: "NG", name: "Nigeria", nativeName: "Nigeria", flag: "🇳🇬", language: "en" },
  { code: "NO", name: "Norway", nativeName: "Norge", flag: "🇳🇴", language: "no" },
  { code: "NZ", name: "New Zealand", nativeName: "Aotearoa", flag: "🇳🇿", language: "en" },
  { code: "PE", name: "Peru", nativeName: "Perú", flag: "🇵🇪", language: "es" },
  { code: "PH", name: "Philippines", nativeName: "Pilipinas", flag: "🇵🇭", language: "en" },
  { code: "PL", name: "Poland", nativeName: "Polska", flag: "🇵🇱", language: "pl" },
  { code: "RU", name: "Russia", nativeName: "Россия", flag: "🇷🇺", language: "ru" },
  { code: "SA", name: "Saudi Arabia", nativeName: "المملكة العربية السعودية", flag: "🇸🇦", language: "ar" },
  { code: "SG", name: "Singapore", nativeName: "Singapura", flag: "🇸🇬", language: "en" },
  { code: "ZA", name: "South Africa", nativeName: "South Africa", flag: "🇿🇦", language: "en" },
  { code: "ES", name: "Spain", nativeName: "España", flag: "🇪🇸", language: "es" },
  { code: "SE", name: "Sweden", nativeName: "Sverige", flag: "🇸🇪", language: "sv" },
  { code: "CH", name: "Switzerland", nativeName: "Schweiz", flag: "🇨🇭", language: "de" },
  { code: "TW", name: "Taiwan", nativeName: "台灣", flag: "🇹🇼", language: "tw" },
  { code: "TH", name: "Thailand", nativeName: "ประเทศไทย", flag: "🇹🇭", language: "th" },
  { code: "TR", name: "Turkey", nativeName: "Türkiye", flag: "🇹🇷", language: "tr" },
  { code: "AE", name: "United Arab Emirates", nativeName: "الإمارات العربية المتحدة", flag: "🇦🇪", language: "ar" },
  { code: "GB", name: "United Kingdom", nativeName: "United Kingdom", flag: "🇬🇧", language: "en" },
  { code: "US", name: "United States", nativeName: "United States", flag: "🇺🇸", language: "en" },
  { code: "VN", name: "Vietnam", nativeName: "Việt Nam", flag: "🇻🇳", language: "vi" },
] as const;

// CountryOfficialLanguages maps country codes to their official language codes
// For countries with multiple official languages, the primary language is listed first
// English is prioritized when it's an official language
export const CountryOfficialLanguages: Record<CountryCode, LanguageCode[]> = {
  // Asia
  CN: ["ZH"], // China - Chinese
  JP: ["JA"], // Japan - Japanese
  IN: ["EN", "HI"], // India - English, Hindi
  KR: ["KO"], // South Korea - Korean
  SG: ["EN", "MS", "ZH", "TL"], // Singapore - English, Malay, Chinese, Tamil
  TW: ["TW"], // Taiwan - Traditional Chinese
  TH: ["TH"], // Thailand - Thai
  MY: ["MS"], // Malaysia - Malay
  ID: ["ID"], // Indonesia - Indonesian
  PH: ["EN", "TL"], // Philippines - English, Filipino
  VN: ["VI"], // Vietnam - Vietnamese
  HK: ["EN", "ZH"], // Hong Kong - English, Chinese
  SA: ["AR"], // Saudi Arabia - Arabic
  AE: ["AR"], // United Arab Emirates - Arabic
  TR: ["TR"], // Turkey - Turkish
  IL: ["HE", "AR"], // Israel - Hebrew, Arabic

  // Europe
  DE: ["DE"], // Germany - German
  GB: ["EN"], // United Kingdom - English
  FR: ["FR"], // France - French
  IT: ["IT"], // Italy - Italian
  RU: ["RU"], // Russia - Russian
  ES: ["ES"], // Spain - Spanish
  NL: ["NL"], // Netherlands - Dutch
  CH: ["DE", "FR", "IT"], // Switzerland - German, French, Italian
  SE: ["SV"], // Sweden - Swedish
  PL: ["PL"], // Poland - Polish
  NO: ["NO"], // Norway - Norwegian
  DK: ["DA"], // Denmark - Danish
  FI: ["FI"], // Finland - Finnish

  // North America
  US: ["EN"], // United States - English
  CA: ["EN", "FR"], // Canada - English, French
  MX: ["ES"], // Mexico - Spanish

  // South America
  BR: ["PT"], // Brazil - Portuguese
  AR: ["ES"], // Argentina - Spanish
  CO: ["ES"], // Colombia - Spanish
  CL: ["ES"], // Chile - Spanish
  PE: ["ES"], // Peru - Spanish

  // Africa
  ZA: ["EN", "AF"], // South Africa - English, Afrikaans
  EG: ["AR"], // Egypt - Arabic
  NG: ["EN"], // Nigeria - English
  KE: ["EN", "SW"], // Kenya - English, Swahili

  // Oceania
  AU: ["EN"], // Australia - English
  NZ: ["EN", "MI"], // New Zealand - English, Māori
};

/**
 * GetCountryOfficialLanguages returns the official languages for a given country code
 * @param countryCode - The country code to look up
 * @returns Array of language codes or null if country not found
 */
export function getCountryOfficialLanguages(countryCode: CountryCode): LanguageCode[] | null {
  const languages = CountryOfficialLanguages[countryCode];
  return languages ? languages : null;
}

/**
 * GetPrimaryOfficialLanguage returns the primary official language for a given country code
 * @param countryCode - The country code to look up
 * @returns The primary language code or empty string if country not found
 */
export function getPrimaryOfficialLanguage(countryCode: CountryCode): LanguageCode | "" {
  const languages = getCountryOfficialLanguages(countryCode);
  return languages && languages.length > 0 ? languages[0] : "";
}

/**
 * Check if a language is an official language for a given country
 * @param countryCode - The country code to check
 * @param languageCode - The language code to check
 * @returns True if the language is official for the country
 */
export function isOfficialLanguage(countryCode: CountryCode, languageCode: LanguageCode): boolean {
  const languages = getCountryOfficialLanguages(countryCode);
  return languages ? languages.includes(languageCode) : false;
}

/**
 * Get all countries that have a specific language as official
 * @param languageCode - The language code to search for
 * @returns Array of country codes that have this language as official
 */
export function getCountriesByLanguage(languageCode: LanguageCode): CountryCode[] {
  return Object.entries(CountryOfficialLanguages)
    .filter(([_, languages]) => languages.includes(languageCode))
    .map(([countryCode]) => countryCode as CountryCode);
}
