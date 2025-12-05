import { StandardSchemaV1 } from '@t3-oss/env-core';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },

  // eslint-disable-next-line n/no-process-env
  experimental__runtimeEnv: process.env,

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  // Called when the schema validation fails.
  onValidationError: (issues: ReadonlyArray<StandardSchemaV1.Issue>) => {
    console.error('❌ Invalid environment variables:', issues);
    throw new Error('Invalid environment variables');
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable (${variable}) on the client`
    );
  },
});
