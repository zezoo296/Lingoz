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

export const countryCodeToName = {
    // Arabic-speaking countries
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    EG: "Egypt",
    DZ: "Algeria",
    MA: "Morocco",
    IQ: "Iraq",
    // Bengali
    BD: "Bangladesh",
    // Chinese
    CN: "China",
    HK: "Hong Kong",
    TW: "Taiwan",
    // Czech
    CZ: "Czech Republic",
    // Danish
    DK: "Denmark",
    // Dutch
    NL: "Netherlands",
    BE: "Belgium",
    // English
    US: "United States",
    GB: "United Kingdom",
    AU: "Australia",
    CA: "Canada",
    // Finnish
    FI: "Finland",
    // French
    FR: "France",
    // German
    DE: "Germany",
    AT: "Austria",
    CH: "Switzerland",
    // Greek
    GR: "Greece",
    // Gujarati / Hindi / Marathi / Punjabi / Telugu / Tamil / Urdu
    IN: "India",
    // Hausa
    NG: "Nigeria",
    NE: "Niger",
    // Hebrew
    IL: "Israel",
    // Hungarian
    HU: "Hungary",
    // Indonesian / Malay
    ID: "Indonesia",
    MY: "Malaysia",
    // Italian
    IT: "Italy",
    // Japanese
    JP: "Japan",
    // Korean
    KR: "South Korea",
    KP: "North Korea",
    // Persian (Farsi)
    IR: "Iran",
    // Polish
    PL: "Poland",
    // Portuguese
    BR: "Brazil",
    PT: "Portugal",
    // Romanian
    RO: "Romania",
    // Russian
    RU: "Russia",
    // Spanish
    ES: "Spain",
    MX: "Mexico",
    AR: "Argentina",
    CO: "Colombia",
    // Swahili
    KE: "Kenya",
    TZ: "Tanzania",
    // Swedish
    SE: "Sweden",
    // Tagalog
    PH: "Philippines",
    // Thai
    TH: "Thailand",
    // Turkish
    TR: "Turkey",
    // Ukrainian
    UA: "Ukraine",
    // Vietnamese
    VN: "Vietnam",
    // Zulu
    ZA: "South Africa",
} as const;

export type CountryCode = keyof typeof countryCodeToName;
export type CountryName = (typeof countryCodeToName)[CountryCode];

export const countryOptions: { code: CountryCode; name: CountryName }[] =
    Object.entries(countryCodeToName).map(([code, name]) => ({
        code: code as CountryCode,
        name,
    }));

// Helper: get country name from code
export const getCountryNameFromCode = (code: CountryCode): string => {
    return countryCodeToName[code] ?? code;
};

// Helper: get code from country name
export const getCountryCodeFromName = (
    name: CountryName,
): CountryCode | undefined => {
    const entry = countryOptions.find((opt) => opt.name === name);
    return entry?.code;
};
