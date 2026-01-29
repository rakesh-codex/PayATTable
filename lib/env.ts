// Environment variable validation and types
// This ensures all required env vars are present at build time

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // JWT for custom auth
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-min-32-characters-long-change-in-production",

  // App config
  NODE_ENV: process.env.NODE_ENV || "development",
} as const

// Validate environment variables on import
if (typeof window === "undefined") {
  console.log("[v0] Environment variables validated successfully")
}
