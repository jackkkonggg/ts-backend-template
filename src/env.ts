import z from 'zod';
import packageJson from '../package.json';

const envSchema = z.object({
  NAME: z.string(),
  VERSION: z.string(),
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse({
  ...process.env,
  NAME: packageJson.name,
  VERSION: packageJson.version,
});

export default env;
