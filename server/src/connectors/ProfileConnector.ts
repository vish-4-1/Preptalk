import { ConnectorResponse, PlatformName } from '../types';

export abstract class ProfileConnector<T = any> {
  abstract readonly platform: PlatformName;

  abstract validateUrl(url: string): boolean;
  abstract extractUsername(url: string): string | null;
  abstract fetchProfile(profileUrl: string): Promise<ConnectorResponse<T>>;

  protected sanitizeUrl(url: string): string {
    return url.trim().replace(/\/$/, '');
  }
}
