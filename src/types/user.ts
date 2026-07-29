export interface PersonalitySummary {
  type: string; // "INTJ"
  label: string; // "Le Stratège"
  description: string; // Texte complet
  strengths: string[]; // Ex: ["Créatif", "Logique"]
  weaknesses: string[]; // Ex: ["Impulsif", "Impatient"]
  suggestedSectors: string[]; // Ex: ["Product Manager", "UX Designer"]
  dimensionInsights?: Array<{
    key: 'EI' | 'SN' | 'TF' | 'JP';
    label: string;
    preference: string;
    score: number;
    intensity: 'léger' | 'marqué' | 'fort';
    description: string;
  }>;
  workPreferences?: string[];

  scoreBreakdown: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
}

export interface UserFull {
  id: string;

  email: string;
  firstName: string;
  lastName: string;

  birthYear?: number;
  gender?: 'male' | 'female' | 'other' | 'undisclosed';
  subscription: 'free' | 'premium';

  addressStreet?: string;
  addressCity?: string;
  addressPostalCode?: string;
  addressCountry?: string;

  locationPref?: 'remote' | 'hybrid' | 'on-site';
  remote?: boolean;
  jobTypes?: string[];

  avatarUrl?: string;

  isEmailVerified: boolean;
  consentAccepted: boolean;

  personalityTestId?: string;
  skillsAssessmentId?: string;

  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  personality?: PersonalitySummary | null;
}
