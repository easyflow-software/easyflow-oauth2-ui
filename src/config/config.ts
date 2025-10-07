"use server";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  REMOTE_URL: z.string(),
  BASE_URL: z.string(),
});

type EnvironmentConfiguration = z.infer<typeof environmentSchema>;

// Cache for validated environment configuration
let serverEnvConfigurationCache: EnvironmentConfiguration | null = null;

/**
 * Validates and caches the environment configuration
 */
function getValidatedEnv(): EnvironmentConfiguration {
  if (serverEnvConfigurationCache) {
    return serverEnvConfigurationCache;
  }

  // Parse and validate process.env
  // Zod will automatically strip unknown properties
  serverEnvConfigurationCache = environmentSchema.parse(process.env);
  return serverEnvConfigurationCache;
}

/**
 * Get a specific environment configuration value
 */
export async function getConfig<T extends keyof EnvironmentConfiguration>(
  key: T,
): Promise<EnvironmentConfiguration[T]> {
  return getValidatedEnv()[key];
}

/**
 * Get the NODE_ENV configuration
 */
export async function getNodeEnv(): Promise<
  EnvironmentConfiguration["NODE_ENV"]
> {
  return getConfig("NODE_ENV");
}

/**
 * Get the REMOTE_URL configuration
 */
export async function getRemoteUrl(): Promise<
  EnvironmentConfiguration["REMOTE_URL"]
> {
  return getConfig("REMOTE_URL");
}

/**
 * Get the BASE_URL configuration
 */
export async function getBaseUrl(): Promise<
  EnvironmentConfiguration["BASE_URL"]
> {
  return getConfig("BASE_URL");
}
