# Lingua Chat Backend

## Run locally

```bash
npm install
npm run prisma:generate
npm run dev
```

## Docker

```bash
docker compose up --build
```

## Notes

- Environment variables are managed through `.env`.
- Prisma schema is located in `prisma/schema.prisma`.
- The app exposes a health endpoint at `/` and sample users at `/users`.
