interface Config {
  api: {
    baseUrl: string;
  };
  websocket: {
    gameUrl: string;
    badgeUrl: string;
  };
}

let config: Config | null = null;

/**
 * Load configuration from config.json
 * This works in both development and production builds
 */
export async function loadConfig(): Promise<Config> {
  if (config) {
    return config;
  }

  try {
    // In Next.js, we can import JSON files directly
    // This will be bundled and available in production
    const configModule = await import('../config.json');
    config = configModule.default || configModule;
    
    console.log('Configuration loaded:', config);
    return config;
  } catch (error) {
    console.error('Failed to load config.json, using fallback values:', error);
    
    // Fallback configuration
    config = {
      api: {
        baseUrl: "http://172.16.10.201:8000/api"
      },
      websocket: {
        gameUrl: "ws://172.16.10.201:8000/ws",
        badgeUrl: "ws://localhost:8000"
      }
    };
    
    return config;
  }
}

/**
 * Get configuration synchronously (must call loadConfig first)
 */
export function getConfig(): Config {
  if (!config) {
    throw new Error('Configuration not loaded. Call loadConfig() first.');
  }
  return config;
}

/**
 * Get API base URL
 */
export async function getApiBaseUrl(): Promise<string> {
  const cfg = await loadConfig();
  return cfg.api.baseUrl;
}

/**
 * Get game WebSocket URL
 */
export async function getGameWebSocketUrl(): Promise<string> {
  const cfg = await loadConfig();
  return cfg.websocket.gameUrl;
}

/**
 * Get badge WebSocket URL
 */
export async function getBadgeWebSocketUrl(): Promise<string> {
  const cfg = await loadConfig();
  return cfg.websocket.badgeUrl;
}
