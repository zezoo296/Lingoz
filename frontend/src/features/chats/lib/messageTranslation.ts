export const languageNameToCode = {
    Afrikaans: "af",
    Arabic: "ar",
    Bengali: "bn",
    Cantonese: "yue",
    Chinese: "zh",
    "Chinese (Simplified)": "zh-HANS",
    "Chinese (Traditional)": "zh-HANT",
    Czech: "cs",
    Danish: "da",
    Dutch: "nl",
    "English (American)": "en-US",
    "English (British)": "en-GB",
    Finnish: "fi",
    French: "fr",
    German: "de",
    Greek: "el",
    Gujarati: "gu",
    Hausa: "ha",
    Hebrew: "he",
    Hindi: "hi",
    Hungarian: "hu",
    Indonesian: "id",
    Italian: "it",
    Japanese: "ja",
    Korean: "ko",
    Malay: "ms",
    Marathi: "mr",
    "Norwegian Bokmål": "nb",
    Persian: "fa",
    Polish: "pl",
    "Portuguese (Brazil)": "pt-BR",
    "Portuguese (Portugal)": "pt-PT",
    Punjabi: "pa",
    Romanian: "ro",
    Russian: "ru",
    Spanish: "es",
    "Spanish (Latin America)": "es-419",
    Swahili: "sw",
    Swedish: "sv",
    Tagalog: "tl",
    Tamil: "ta",
    Telugu: "te",
    Thai: "th",
    Turkish: "tr",
    Ukrainian: "uk",
    Urdu: "ur",
    Vietnamese: "vi",
    Yiddish: "yi",
    Zulu: "zu",
} as const;

export type LanguageName = keyof typeof languageNameToCode;
export type LanguageCode = (typeof languageNameToCode)[LanguageName];

export const languageOptions: { name: LanguageName; code: LanguageCode }[] =
    Object.entries(languageNameToCode).map(([name, code]) => ({
        name: name as LanguageName,
        code,
    }));

// Helper to get user-friendly name from code (for showing "Translated to Spanish")
export const getLanguageNameFromCode = (code: LanguageCode): string => {
    const entry = languageOptions.find((opt) => opt.code === code);
    return entry?.name ?? code;
};
