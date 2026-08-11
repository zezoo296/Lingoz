import { Prisma } from "../generated/prisma/client";

// Automatically adds isDeleted=false to every user find query (except find unique)
export const excludeDeletedUsers = Prisma.defineExtension({
    name: "excludeDeletedUsers",

    query: {
        user: {
            async findFirst({ args, query }) {
                args.where = {
                    ...args.where,
                    isDeleted: false,
                };

                return query(args);
            },

            async findFirstOrThrow({ args, query }) {
                args.where = {
                    ...args.where,
                    isDeleted: false,
                };

                return query(args);
            },

            async findMany({ args, query }) {
                args.where = {
                    ...args.where,
                    isDeleted: false,
                };

                return query(args);
            },

            async count({ args, query }) {
                args.where = {
                    ...args.where,
                    isDeleted: false,
                };

                return query(args);
            },

            async aggregate({ args, query }) {
                args.where = {
                    ...args.where,
                    isDeleted: false,
                };

                return query(args);
            },
        },
    },
});
