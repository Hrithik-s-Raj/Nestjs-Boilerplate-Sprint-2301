import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiConfigService {
  public static initialiseEnvVariable() {
    this.appConfig();
  }

  private static getString(key: string): string {
    const value = process.env[key];
    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    try {
      return value.toString().replace(/\\n/g, '/n');
    } catch (error) {
      console.log(error);
    }
  }

  private static getBoolean(key: string): boolean {
    const value = process.env[key];
    if (value === undefined) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private static getNumber(key: string): number {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  public static appConfig() {
    return {
      port: this.getNumber('PORT'),
      env: this.getString('APP_ENV'),
      database: this.getString('DATABASE_URL'),
    };
  }

  public static test() {
    return {
      test1: this.getString('TEST'),
    };
  }
}
