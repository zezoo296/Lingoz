import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { Pool } from "pg";
import { excludeDeletedUsers } from "./prismaExtension";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
}).$extends(excludeDeletedUsers);

export default prisma;
