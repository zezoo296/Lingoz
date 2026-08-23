export interface Language {
    name: string;
    flag: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    avatar: string;
    nativeLang: string;
    nativeFlag: string;
    englishLevel: string;
    englishFlag: string;
    learning: Language[];
    location: string;
    isOnline: boolean;
    lastActive: string | null;
    isVerified: boolean;
}
