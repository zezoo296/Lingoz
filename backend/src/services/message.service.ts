import { getChatMessageForUser } from "../repositories/chats.repository";
import AppError from "../utils/AppError";
import translator from "../config/deepl";
import { TargetLanguageCode, SourceLanguageCode } from "deepl-node";

const translateText = async (
    text: string,
    targetLanguage: TargetLanguageCode,
    sourceLanguage?: SourceLanguageCode,
) => {
    const result = await translator.translateText(
        text,
        sourceLanguage ?? null, // null => autodetect
        targetLanguage,
    );

    return {
        text: result.text,
        detectedSourceLanguage: result.detectedSourceLang,
    };
};

const supportedLanguageCodes = new Set<string>([
    "af",
    "ar",
    "bn",
    "yue",
    "zh",
    "zh-HANS",
    "zh-HANT",
    "cs",
    "da",
    "nl",
    "en-US",
    "en-GB",
    "fi",
    "fr",
    "de",
    "el",
    "gu",
    "ha",
    "he",
    "hi",
    "hu",
    "id",
    "it",
    "ja",
    "ko",
    "ms",
    "mr",
    "nb",
    "fa",
    "pl",
    "pt-BR",
    "pt-PT",
    "pa",
    "ro",
    "ru",
    "es",
    "es-419",
    "sw",
    "sv",
    "tl",
    "ta",
    "te",
    "th",
    "tr",
    "uk",
    "ur",
    "vi",
    "yi",
    "zu",
]);

export const translateMessageService = async (
    messageId: string,
    userId: number,
    targetLanguage: any,
) => {
    const message = await getChatMessageForUser(messageId, userId);

    if (!message) {
        throw new AppError("Message not found", 404);
    }

    if (message.chat.participants.length === 0) {
        throw new AppError("User is not a participant in this chat", 403);
    }

    if (!supportedLanguageCodes.has(targetLanguage)) {
        throw new AppError("Unsupported target language", 400);
    }

    return translateText(message.content, targetLanguage);
};
