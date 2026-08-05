/**
 * Environment configuration manager
 * Provides type-safe access to environment-specific settings
 */

export interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  name: string;
}

export class EnvConfig {
  private static instance: EnvConfig;
  private environment: string;
  private config: EnvironmentConfig;

  private constructor() {
    this.environment = process.env.ENV || 'dev';
    this.config = this.loadConfig();
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const configs: Record<string, EnvironmentConfig> = {
      dev: {
        name: 'Development',
        baseURL: process.env.DEV_BASE_URL || 'https://dev.example.com',
        apiURL: process.env.DEV_API_URL || 'https://api-dev.example.com',
      },
      st: {
        name: 'System Test',
        baseURL: process.env.ST_BASE_URL || 'https://st.example.com',
        apiURL: process.env.ST_API_URL || 'https://api-st.example.com',
      },
      sit: {
        name: 'System Integration Test',
        baseURL: process.env.SIT_BASE_URL || 'https://sit.example.com',
        apiURL: process.env.SIT_API_URL || 'https://api-sit.example.com',
      },
      e2e: {
        name: 'End-to-End',
        baseURL: process.env.E2E_BASE_URL || 'https://e2e.example.com',
        apiURL: process.env.E2E_API_URL || 'https://api-e2e.example.com',
      },
    };

    return configs[this.environment] || configs.dev;
  }

  public get(): EnvironmentConfig {
    return this.config;
  }

  public getEnvironment(): string {
    return this.environment;
  }

  public getBaseURL(): string {
    return this.config.baseURL;
  }

  public getApiURL(): string {
    return this.config.apiURL;
  }
}

// Export singleton instance
export const envConfig = EnvConfig.getInstance();
