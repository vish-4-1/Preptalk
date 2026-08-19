import { ProfileConnector } from './ProfileConnector';
import { ConnectorResponse, PlatformName } from '../types';

export interface LinkedInPublicData {
  profileUrl: string;
  username: string;
  verifiedStatus: string;
  skillsExtracted: string[];
  certifications: string[];
}

export class LinkedInConnector extends ProfileConnector<LinkedInPublicData> {
  readonly platform: PlatformName = 'LINKEDIN';

  validateUrl(url: string): boolean {
    if (!url) return false;
    const clean = this.sanitizeUrl(url);
    return /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(clean);
  }

  extractUsername(url: string): string | null {
    if (!this.validateUrl(url)) return null;
    const clean = this.sanitizeUrl(url);
    const parts = clean.split('linkedin.com/in/');
    if (parts.length < 2) return null;
    return parts[1].split('/')[0];
  }

  async fetchProfile(profileUrl: string): Promise<ConnectorResponse<LinkedInPublicData>> {
    const username = this.extractUsername(profileUrl);
    if (!username) {
      return {
        success: false,
        platform: this.platform,
        rawProfileUrl: profileUrl,
        error: 'Invalid LinkedIn URL format',
        isPublicDataOnly: true,
      };
    }

    return {
      success: true,
      platform: this.platform,
      rawProfileUrl: profileUrl,
      data: {
        profileUrl,
        username,
        verifiedStatus: 'Connected (Public Profile Metadata Only)',
        skillsExtracted: ['Java', 'React.js', 'Data Structures', 'REST APIs', 'PostgreSQL'],
        certifications: ['AWS Certified Cloud Practitioner', 'MetaData Science Professional Certificate'],
      },
      isPublicDataOnly: true,
    };
  }
}
