export type Vertical = "Payments" | "Fintech" | "Travel" | "Treasury" | "SaaS" | "Banking";

export type Region = "North America" | "Europe" | "APAC" | "Middle East";

export type Tier = "A" | "B" | "C" | "Watch";

export type IntentLevel = "High" | "Medium" | "Low" | "Curious";

export type HubSpotStatus = "not_synced" | "mock_synced" | "synced" | "failed";

export interface Conference {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  region: Region;
  verticals: Vertical[];
  estimatedAudienceSize: number;
  targetRoles: string[];
  sourceUrl: string;
  description: string;
  grainAngle: string;
  scoreInputs: {
    verticalFit: number;
    buyerDensity: number;
    audienceQuality: number;
    geographyFit: number;
    timingClusterPotential: number;
    logisticsPracticality: number;
  };
}

export interface ScoredConference extends Conference {
  score: number;
  tier: Tier;
}

export interface Lead {
  id: string;
  conferenceId: string;
  capturedAt: string;
  fullName: string;
  company: string;
  title: string;
  email?: string;
  phone?: string;
  notes: string;
  intent: IntentLevel;
  tags: string[];
  hubspotStatus: HubSpotStatus;
  syncedAt?: string;
}

export interface ContactGroup {
  id: string;
  displayName: string;
  primaryCompany: string;
  encounters: Lead[];
  confidence: "exact" | "strong" | "possible" | "single";
  reasons: string[];
  relationshipSignal: "Warming" | "Tire-kicker risk" | "New" | "Needs review";
  interpretation: string;
}

export interface RelationshipSummary {
  mode: "ai" | "mock";
  relationshipArc: string;
  recommendedNudge: string;
  followUpEmail: string;
  risk: string;
}
