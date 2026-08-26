import { getUsersService } from "../services/user.service";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { userQueryParamsSchema } from "@linguachat/shared";

export const getUsers = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Incorrect params.", 400);

    const limit = Number(req.query.limit) || 20;
    const cursor =
        typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const result = userQueryParamsSchema.safeParse(req.query);

    if (!result.success) {
        throw new AppError("Invalid query parameters", 400);
    }

    const queryParams = result.data;

    const discoveryUsers = await getUsersService(
        userId,
        cursor,
        limit,
        queryParams,
    );

    res.status(200).json({
        status: "success",
        data: discoveryUsers,
    });
});
