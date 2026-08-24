import { translateMessageService } from "../services/message.service";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

export const translateMessage = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const messageId = req.params.id;
    const targetLanguage = req.body.targetLanguage ;

    if (!userId || !messageId || !targetLanguage)
        throw new AppError("Incomplete params", 400);

    const translation = await translateMessageService(messageId, userId, targetLanguage);

    res.status(200).json({
        status: "success",
        data: translation,
    });
});
