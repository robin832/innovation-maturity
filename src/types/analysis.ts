/** Shapes returned by the Supabase edge function */

export interface MaturityDimension {
  key: string;
  label: string;
  score: number;       // 0–5 in 0.5 increments
  description: string; // 1-sentence assessment
  evidence: string;    // source cited (e.g. "Annual Report 2024", "LinkedIn job postings")
}

export interface StrategicGoal {
  title: string;
  description: string;
  source: string; // e.g. "Press release March 2025"
}

export interface ActiveProject {
  name: string;
  description: string;
  status: "announced" | "ongoing" | "pilot";
}

export interface CompanyAnalysis {
  companyName: string;
  companyType: "industrial" | "technology";
  summary: string;
  dataConfidence: "high" | "medium" | "low";
  overallScore: number;
  dimensions: MaturityDimension[];
  technologyStack: string[];
  strategicGoals: StrategicGoal[];
  strategicGoalsNote: string | null; // set when goals can't be publicly verified
  activeProjects: ActiveProject[];
  innovationGaps: string[];
  beaconMatchRationale: string;
}

export interface EcosystemMatch {
  id: string;
  name: string;
  category: string;
  description: string;
  whyMatch: string;
  matchScore: number; // 0-100
  visible: boolean;   // false = blurred/locked
}

export interface ProposalPoint {
  offeringId: string;  // references BRAND.memberships or BRAND.services id
  offeringName: string;
  whyRelevant: string; // 2-3 sentences tailored to the company
}

export interface EcosystemEvent {
  id: string;
  title: string;
  date: string;        // ISO date
  time: string;
  location: string;
  description: string;
  relevance: string;   // why it matters for this specific company
  category: string;
}

export interface MatchesResult {
  matches: EcosystemMatch[];
  proposalPoints: ProposalPoint[];
  events: EcosystemEvent[];
}

export type AnalysisAction = "analyze_company" | "generate_matches";
