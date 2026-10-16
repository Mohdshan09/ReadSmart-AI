import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // Migrations should use a direct connection when the provider supplies one.
  // DATABASE_URL remains the runtime (possibly pooled) application connection.
  datasource: {
    url: env('DATABASE_URL'),
  },
});
