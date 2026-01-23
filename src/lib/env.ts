/**
 * Environment variable validation
 * Validates required environment variables at app startup
 */

interface EnvConfig {
  // Required
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;

  // Optional with defaults
  VITE_SITE_VARIANT: 'menu' | 'vip';
  VITE_STRIPE_PUBLISHABLE_KEY?: string;
  VITE_EMAILJS_PUBLIC_KEY?: string;
  VITE_EMAIL_WEBHOOK_URL?: string;
}

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

const optionalEnvVars = [
  'VITE_SITE_VARIANT',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_EMAIL_WEBHOOK_URL',
] as const;

function validateEnv(): EnvConfig {
  const missing: string[] = [];

  for (const key of requiredEnvVars) {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);

    // In development, show a helpful message
    if (import.meta.env.DEV) {
      console.error('Please check your .env file and ensure all required variables are set.');
      console.error('You can copy .env.example to .env and fill in the values.');
    }

    throw new Error(message);
  }

  // Log warnings for missing optional vars in development
  if (import.meta.env.DEV) {
    for (const key of optionalEnvVars) {
      if (!import.meta.env[key]) {
        console.warn(`Optional environment variable ${key} is not set`);
      }
    }
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SITE_VARIANT: (import.meta.env.VITE_SITE_VARIANT as 'menu' | 'vip') || 'menu',
    VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    VITE_EMAIL_WEBHOOK_URL: import.meta.env.VITE_EMAIL_WEBHOOK_URL,
  };
}

// Validate on import
export const env = validateEnv();

// Helper to check if a feature is available
export const hasStripe = () => !!env.VITE_STRIPE_PUBLISHABLE_KEY;
export const hasEmail = () => !!env.VITE_EMAILJS_PUBLIC_KEY || !!env.VITE_EMAIL_WEBHOOK_URL;
export const isVipSite = () => env.VITE_SITE_VARIANT === 'vip';
