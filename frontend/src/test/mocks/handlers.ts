import { type HttpHandler } from "msw";

/**
 * Default MSW request handlers.
 * Feature-specific handlers can be added in subsequent waves or per-test using `server.use(...)`.
 */
export const handlers: HttpHandler[] = [];
