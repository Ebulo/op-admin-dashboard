const getEnv = (key: string, fallback?: string): string => {
    const value = process.env[key];
    if (!value && fallback === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value ?? fallback!;
};

export const config = {
    // apiBaseUrl: getEnv("NEXT_PUBLIC_API_BASE_URL"),
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    environment: getEnv("NEXT_PUBLIC_ENV", "development"),
    // Add other environment variables here as needed
};
